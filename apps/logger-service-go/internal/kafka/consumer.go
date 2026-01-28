package kafka

import (
	"context"
	"log"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/eshop/logger-service-go/internal/otel"
	"github.com/eshop/logger-service-go/internal/websocket"
)

// Consumer wraps Kafka consumer functionality
type Consumer struct {
	consumer   *kafka.Consumer
	hub        *websocket.Hub
	logger     *otel.Logger
	topic      string
	logQueue   [][]byte
	queueLimit int
	ctx        context.Context
	cancel     context.CancelFunc
}

// NewConsumer creates a new Kafka consumer
func NewConsumer(broker, apiKey, apiSecret, topic, groupID string, hub *websocket.Hub, logger *otel.Logger) (*Consumer, error) {
	config := &kafka.ConfigMap{
		"bootstrap.servers": broker,
		"group.id":          groupID,
		"auto.offset.reset": "latest",
		"security.protocol": "SASL_SSL",
		"sasl.mechanisms":   "PLAIN",
		"sasl.username":     apiKey,
		"sasl.password":     apiSecret,
	}

	consumer, err := kafka.NewConsumer(config)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(context.Background())

	return &Consumer{
		consumer:   consumer,
		hub:        hub,
		logger:     logger,
		topic:      topic,
		logQueue:   make([][]byte, 0),
		queueLimit: 100,
		ctx:        ctx,
		cancel:     cancel,
	}, nil
}

// Start begins consuming messages from Kafka
func (c *Consumer) Start() error {
	// Subscribe to topic
	err := c.consumer.SubscribeTopics([]string{c.topic}, nil)
	if err != nil {
		return err
	}

	log.Printf("Kafka consumer subscribed to topic: %s", c.topic)

	// Start queue processor
	go c.processQueue()

	// Start consuming messages
	go c.consumeMessages()

	return nil
}

// consumeMessages reads messages from Kafka and adds them to the queue
func (c *Consumer) consumeMessages() {
	for {
		select {
		case <-c.ctx.Done():
			log.Println("Kafka consumer stopping...")
			return
		default:
			// Use timeout to allow checking context periodically
			msg, err := c.consumer.ReadMessage(100 * time.Millisecond)
			if err != nil {
				// Timeout is expected, just continue
				kafkaErr, ok := err.(kafka.Error)
				if ok && kafkaErr.Code() == kafka.ErrTimedOut {
					continue
				}
				log.Printf("Kafka consumer error: %v", err)
				continue
			}

			if msg.Value != nil {
				c.logQueue = append(c.logQueue, msg.Value)

				// Prevent queue from growing too large
				if len(c.logQueue) > c.queueLimit {
					c.logQueue = c.logQueue[1:]
				}
			}
		}
	}
}

// processQueue processes queued log messages every 3 seconds
func (c *Consumer) processQueue() {
	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			// Process remaining logs before shutting down
			c.processLogs()
			log.Println("Queue processor stopped")
			return
		case <-ticker.C:
			c.processLogs()
		}
	}
}

// processLogs processes all queued logs
func (c *Consumer) processLogs() {
	if len(c.logQueue) == 0 {
		return
	}

	log.Printf("Processing %d logs in batch", len(c.logQueue))

	// Process all queued logs
	logs := make([][]byte, len(c.logQueue))
	copy(logs, c.logQueue)
	c.logQueue = c.logQueue[:0] // Clear the queue

	for _, logData := range logs {
		// Send to OpenTelemetry/Loki
		c.logger.LogFromJSON(logData)

		// Broadcast to WebSocket clients
		c.hub.Broadcast(logData)
	}
}

// Close closes the Kafka consumer
func (c *Consumer) Close() error {
	log.Println("Closing Kafka consumer...")
	c.cancel()                         // Signal goroutines to stop
	time.Sleep(500 * time.Millisecond) // Give goroutines time to finish
	return c.consumer.Close()
}
