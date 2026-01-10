package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	KafkaBrokerURL string
	KafkaAPIKey    string
	KafkaAPISecret string
	KafkaTopic     string
	KafkaGroupID   string
	DatabaseURL    string
}

func Load() *Config {
	// Load .env file if present
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	return &Config{
		KafkaBrokerURL: getEnv("KAFKA_BROKER_URL", "localhost:9092"),
		KafkaAPIKey:    getEnv("KAFKA_API_KEY", ""),
		KafkaAPISecret: getEnv("KAFKA_API_SECRET", ""),
		KafkaTopic:     getEnv("KAFKA_TOPIC", "users-events"),
		KafkaGroupID:   getEnv("KAFKA_GROUP_ID", "user-events-group-go"),
		DatabaseURL:    getEnv("DATABASE_URL", "mongodb://localhost:27017/eshop"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
