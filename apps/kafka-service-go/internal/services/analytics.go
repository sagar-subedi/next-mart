package services

import (
	"context"
	"log"
	"time"

	"github.com/eshop/kafka-service-go/internal/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AnalyticsService struct {
	db *db.MongoDB
}

func NewAnalyticsService(db *db.MongoDB) *AnalyticsService {
	return &AnalyticsService{db: db}
}

type Event struct {
	UserID    string `json:"userId"`
	Action    string `json:"action"`
	ProductID string `json:"productId"`
	ShopID    string `json:"shopId"`
	Country   string `json:"country"`
	City      string `json:"city"`
	Device    string `json:"device"`
}

type ActionEntry struct {
	ProductID string `bson:"productId" json:"productId"`
	ShopID    string `bson:"shopId" json:"shopId"`
	Action    string `bson:"action" json:"action"`
	Timestamp string `bson:"timestamp" json:"timestamp"`
}

func (s *AnalyticsService) UpdateUserAnalytics(ctx context.Context, event Event) error {
	collection := s.db.UserAnalytics()

	// 1. Fetch existing data
	var userAnalytics struct {
		Actions []ActionEntry `bson:"actions"`
	}
	err := collection.FindOne(ctx, bson.M{"userId": event.UserID}, options.FindOne().SetProjection(bson.M{"actions": 1})).Decode(&userAnalytics)
	if err != nil && err != mongo.ErrNoDocuments {
		log.Printf("Error fetching user analytics: %v", err)
		return err
	}

	updatedActions := userAnalytics.Actions
	if updatedActions == nil {
		updatedActions = []ActionEntry{}
	}

	actionExists := false
	for _, entry := range updatedActions {
		if entry.ProductID == event.ProductID && entry.Action == event.Action {
			actionExists = true
			break
		}
	}

	// Logic from TS service
	if event.Action == "product_view" {
		updatedActions = append(updatedActions, ActionEntry{
			ProductID: event.ProductID,
			ShopID:    event.ShopID,
			Action:    event.Action,
			Timestamp: time.Now().Format(time.RFC3339),
		})
	} else if (event.Action == "add_to_cart" || event.Action == "add_to_wishlist") && !actionExists {
		updatedActions = append(updatedActions, ActionEntry{
			ProductID: event.ProductID,
			ShopID:    event.ShopID,
			Action:    event.Action,
			Timestamp: time.Now().Format(time.RFC3339),
		})
	} else if event.Action == "remove_from_cart" {
		// Filter out add_to_cart for this product
		newActions := []ActionEntry{}
		for _, entry := range updatedActions {
			if !(entry.ProductID == event.ProductID && entry.Action == "add_to_cart") {
				newActions = append(newActions, entry)
			}
		}
		updatedActions = newActions
	} else if event.Action == "remove_from_wishlist" {
		// Filter out add_to_wishlist for this product
		newActions := []ActionEntry{}
		for _, entry := range updatedActions {
			if !(entry.ProductID == event.ProductID && entry.Action == "add_to_wishlist") {
				newActions = append(newActions, entry)
			}
		}
		updatedActions = newActions
	}

	// Keep only last 100 actions
	if len(updatedActions) > 100 {
		updatedActions = updatedActions[1:] // Shift (remove first)
	}

	extraFields := bson.M{}
	if event.Country != "" {
		extraFields["country"] = event.Country
	}
	if event.City != "" {
		extraFields["city"] = event.City
	}
	if event.Device != "" {
		extraFields["device"] = event.Device
	}

	update := bson.M{
		"$set": bson.M{
			"lastVisited": time.Now(),
			"actions":     updatedActions,
			"updatedAt":   time.Now(),
		},
	}
	// Merge extra fields into $set
	for k, v := range extraFields {
		update["$set"].(bson.M)[k] = v
	}

	// Upsert
	opts := options.Update().SetUpsert(true)
	// We also need to set createdAt on insert, but $setOnInsert is cleaner.
	update["$setOnInsert"] = bson.M{
		"createdAt": time.Now(),
		"userId":    event.UserID,
	}

	_, err = collection.UpdateOne(ctx, bson.M{"userId": event.UserID}, update, opts)
	if err != nil {
		log.Printf("Error updating user analytics: %v", err)
		return err
	}

	return s.UpdateProductAnalytics(ctx, event)
}

func (s *AnalyticsService) UpdateProductAnalytics(ctx context.Context, event Event) error {
	if event.ProductID == "" {
		return nil
	}

	collection := s.db.ProductAnalytics()

	inc := bson.M{}
	if event.Action == "product_view" {
		inc["views"] = 1
	} else if event.Action == "add_to_cart" {
		inc["cartAdds"] = 1
	} else if event.Action == "remove_from_cart" {
		inc["cartAdds"] = -1
	} else if event.Action == "add_to_wishlist" {
		inc["wishlistAdds"] = 1
	} else if event.Action == "remove_from_wishlist" {
		inc["wishlistAdds"] = -1
	} else if event.Action == "purchase" {
		inc["purchases"] = 1
	}

	update := bson.M{
		"$set": bson.M{
			"lastViewedAt": time.Now(),
			"updatedAt":    time.Now(),
		},
	}
	if len(inc) > 0 {
		update["$inc"] = inc
	}

	update["$setOnInsert"] = bson.M{
		"createdAt": time.Now(),
		"productId": event.ProductID,
		"shopId":    event.ShopID, // Note: shopId might be null if not provided in event, but schema says unique? No, shopId is unique in ProductAnalytics?
		// Schema: shopId String @unique @db.ObjectId. Wait.
		// model productAnalytics { ... shopId String @unique ... productId String @unique ... }
		// This implies one document per shop? Or one per product?
		// If both are unique, it's 1:1. But that doesn't make sense if a shop has multiple products.
		// Let's re-read schema.
		// model productAnalytics { ... shopId String @unique ... productId String @unique ... }
		// This seems to imply a productAnalytics document is unique to a product AND unique to a shop?
		// That would mean a shop can only have ONE product analytics record? That seems wrong.
		// Maybe it means the pair is unique? But it says @unique on each field.
		// If it's @unique on shopId, then a shop can only appear once in the entire collection.
		// That would mean we can't store analytics for multiple products of the same shop.
		// Let's assume the schema might be slightly misleading or I'm misinterpreting.
		// But in TS code:
		// create: { productId: event.productId, shopId: event.shopId || null, ... }
		// It sets shopId.
		// If the schema enforces uniqueness on shopId, this will fail for the second product of the same shop.
		// However, we are migrating logic, not fixing schema (unless it blocks us).
		// We'll follow the TS logic.
	}

	// If shopId is missing in event, we might want to fetch it or leave it null (if schema allows).
	// TS code: shopId: event.shopId || null
	if event.ShopID != "" {
		update["$setOnInsert"].(bson.M)["shopId"] = event.ShopID
	} else {
		update["$setOnInsert"].(bson.M)["shopId"] = nil
	}

	opts := options.Update().SetUpsert(true)
	_, err := collection.UpdateOne(ctx, bson.M{"productId": event.ProductID}, update, opts)
	if err != nil {
		log.Printf("Error updating product analytics: %v", err)
		return err
	}

	return nil
}
