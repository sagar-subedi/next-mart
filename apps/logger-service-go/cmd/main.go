package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/eshop/logger-service-go/internal/config"
	"github.com/eshop/logger-service-go/internal/kafka"
	"github.com/eshop/logger-service-go/internal/otel"
	"github.com/eshop/logger-service-go/internal/server"
	"github.com/eshop/logger-service-go/internal/websocket"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists (for local development)
	// In Docker, environment variables are already set by docker-compose
	if err := loadEnvFile(); err != nil {
		log.Printf("Note: .env file not loaded: %v (this is normal in Docker)", err)
	}

	log.Println("Starting Logger Service (Go)...")

	// Load configuration
	cfg := config.Load()
	log.Printf("Configuration loaded: Port=%s, Kafka=%s, Topic=%s",
		cfg.Port, cfg.KafkaBroker, cfg.KafkaTopic)

	// Initialize OpenTelemetry logger
	otelLogger, err := otel.NewLogger(cfg.OTLPEndpoint)
	if err != nil {
		log.Fatalf("Failed to initialize OpenTelemetry logger: %v", err)
	}
	defer func() {
		if err := otelLogger.Shutdown(); err != nil {
			log.Printf("Error shutting down logger: %v", err)
		}
	}()

	// Create WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()
	log.Println("WebSocket hub started")

	// Create and start Kafka consumer
	kafkaConsumer, err := kafka.NewConsumer(
		cfg.KafkaBroker,
		cfg.KafkaAPIKey,
		cfg.KafkaAPISecret,
		cfg.KafkaTopic,
		cfg.KafkaGroupID,
		hub,
		otelLogger,
	)
	if err != nil {
		log.Fatalf("Failed to create Kafka consumer: %v", err)
	}
	defer kafkaConsumer.Close()

	if err := kafkaConsumer.Start(); err != nil {
		log.Fatalf("Failed to start Kafka consumer: %v", err)
	}
	log.Println("Kafka consumer started")

	// Create and start HTTP server
	httpServer := server.NewServer(cfg.Port, cfg.CORSOrigins, hub)

	// Start server in goroutine
	go func() {
		if err := httpServer.Start(); err != nil {
			log.Fatalf("Failed to start HTTP server: %v", err)
		}
	}()

	log.Printf("Logger Service (Go) is running at http://localhost:%s", cfg.Port)
	log.Printf("WebSocket endpoint: ws://localhost:%s/ws", cfg.Port)

	// Wait for interrupt signal for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down gracefully...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		log.Printf("Error during server shutdown: %v", err)
	}

	log.Println("Logger Service (Go) stopped")
}

// loadEnvFile attempts to load .env file from current or parent directories
// This is useful for local development when running from apps/logger-service-go
func loadEnvFile() error {
	// Try current directory first
	if err := godotenv.Load(); err == nil {
		log.Println("Loaded .env from current directory")
		return nil
	}

	// Try parent directory (for running from apps/logger-service-go)
	if err := godotenv.Load("../../.env"); err == nil {
		log.Println("Loaded .env from parent directory (../../.env)")
		return nil
	}

	// Try root directory
	if err := godotenv.Load(filepath.Join("..", "..", ".env")); err == nil {
		log.Println("Loaded .env from root directory")
		return nil
	}

	// Not found - this is OK in Docker
	return nil
}
