package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/eshop/api-gateway-go/internal/config"
	"github.com/eshop/api-gateway-go/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := loadEnvFile(); err != nil {
		log.Printf("Note: .env file not loaded: %v (this is normal in Docker)", err)
	}

	log.Println("Starting API Gateway (Go)...")

	// Load configuration
	cfg := config.Load()
	log.Printf("Configuration loaded: Port=%s", cfg.Port)

	// Create and start server
	srv := server.NewServer(cfg)

	go func() {
		if err := srv.Start(); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("API Gateway (Go) is running at http://localhost:%s", cfg.Port)

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Error during server shutdown: %v", err)
	}

	log.Println("API Gateway (Go) stopped")
}

func loadEnvFile() error {
	if err := godotenv.Load(); err == nil {
		return nil
	}
	if err := godotenv.Load("../../.env"); err == nil {
		return nil
	}
	if err := godotenv.Load(filepath.Join("..", "..", ".env")); err == nil {
		return nil
	}
	return nil
}
