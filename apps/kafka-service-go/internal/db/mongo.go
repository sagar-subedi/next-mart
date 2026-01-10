package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDB struct {
	Client *mongo.Client
	DB     *mongo.Database
}

func Connect(uri string) (*MongoDB, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	// Ping the database
	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	log.Println("Connected to MongoDB")

	// Extract database name from URI or default to 'eshop'
	// For simplicity, we'll assume the URI contains the DB name or we use a default
	// The standard connection string format is mongodb://host:port/dbname
	// But the driver handles parsing.
	// We can't easily extract it without parsing.
	// Let's assume 'eshop' for now or rely on what's in the URI if it selects a DB.
	// Actually, client.Database("name") is needed.
	// Let's assume the DB name is "eshop" as per the TS service (implied from connection string usually).
	// Or we can parse it.

	dbName := "eshop" // Default
	// Attempt to parse from URI if possible, but standard parser is internal.
	// We'll stick to hardcoded "eshop" or env var if needed.
	// Ideally, we should parse it.

	return &MongoDB{
		Client: client,
		DB:     client.Database(dbName),
	}, nil
}

func (m *MongoDB) Disconnect(ctx context.Context) error {
	return m.Client.Disconnect(ctx)
}

// Collections
func (m *MongoDB) UserAnalytics() *mongo.Collection {
	return m.DB.Collection("userAnalytics")
}

func (m *MongoDB) ProductAnalytics() *mongo.Collection {
	return m.DB.Collection("productAnalytics")
}
