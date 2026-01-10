package kafka

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/eshop/kafka-service-go/internal/config"
	"github.com/eshop/kafka-service-go/internal/services"
)

type Consumer struct {
	consumer  *kafka.Consumer
	analytics *services.AnalyticsService
	topic     string
	ctx       context.Context
	cancel    context.CancelFunc
}

func NewConsumer(cfg *config.Config, analytics *services.AnalyticsService) (*Consumer, error) {
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": cfg.KafkaBrokerURL,
		"group.id":          cfg.KafkaGroupID,
		"auto.offset.reset": "earliest",
		// SASL configuration if needed (based on logger-service)
		"security.protocol": "SASL_SSL",
		"sasl.mechanisms":   "PLAIN",
		"sasl.username":     cfg.KafkaAPIKey,
		"sasl.password":     cfg.KafkaAPISecret,
	})

	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(context.Background())

	return &Consumer{
		consumer:  c,
		analytics: analytics,
		topic:     cfg.KafkaTopic,
		ctx:       ctx,
		cancel:    cancel,
	}, nil
}

func (c *Consumer) Start() error {
	err := c.consumer.SubscribeTopics([]string{c.topic}, nil)
	if err != nil {
		return err
	}

	log.Printf("Kafka consumer started, subscribed to topic: %s", c.topic)

	go c.consumeLoop()

	return nil
}

func (c *Consumer) consumeLoop() {
	for {
		select {
		case <-c.ctx.Done():
			return
		default:
			msg, err := c.consumer.ReadMessage(100 * time.Millisecond)
			if err != nil {
				if err.(kafka.Error).Code() == kafka.ErrTimedOut {
					continue
				}
				log.Printf("Consumer error: %v", err)
				continue
			}

			c.processMessage(msg)
		}
	}
}

func (c *Consumer) processMessage(msg *kafka.Message) {
	var event services.Event
	if err := json.Unmarshal(msg.Value, &event); err != nil {
		log.Printf("Error unmarshalling message: %v", err)
		return
	}

	// Validate event action (logic from TS main.ts)
	validActions := map[string]bool{
		"add_to_wishlist":      true,
		"add_to_cart":          true,
		"product_view":         true,
		"purchase":             true,
		"remove_from_cart":     true,
		"remove_from_wishlist": true,
		"shop_visit":           true, // Mentioned in TS main.ts but logic was empty/commented out
	}

	if !validActions[event.Action] {
		return
	}

	// TS main.ts: if (event.action === 'shop_visit') { // update shop analytics }
	// But the implementation was empty comment. We'll skip it for now or add a placeholder.
	if event.Action == "shop_visit" {
		// Placeholder for shop analytics
		return
	}

	// Process user/product analytics
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := c.analytics.UpdateUserAnalytics(ctx, event); err != nil {
		log.Printf("Error processing event: %v", err)
	}
}

func (c *Consumer) Close() {
	c.cancel()
	c.consumer.Close()
	log.Println("Kafka consumer closed")
}
