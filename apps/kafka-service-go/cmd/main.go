package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/eshop/kafka-service-go/internal/config"
	"github.com/eshop/kafka-service-go/internal/db"
	"github.com/eshop/kafka-service-go/internal/kafka"
	"github.com/eshop/kafka-service-go/internal/services"
)

func main() {
	log.Println("Starting Kafka Service (Go)...")

	// Load configuration
	cfg := config.Load()

	// Connect to MongoDB
	mongoDB, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := mongoDB.Disconnect(context.Background()); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	// Initialize Analytics Service
	analyticsService := services.NewAnalyticsService(mongoDB)

	// Initialize Kafka Consumer
	consumer, err := kafka.NewConsumer(cfg, analyticsService)
	if err != nil {
		log.Fatalf("Failed to create Kafka consumer: %v", err)
	}

	// Start Consumer
	if err := consumer.Start(); err != nil {
		log.Fatalf("Failed to start Kafka consumer: %v", err)
	}

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down Kafka Service...")

	consumer.Close()

	// Give some time for cleanup
	time.Sleep(1 * time.Second)

	log.Println("Kafka Service stopped")
}
