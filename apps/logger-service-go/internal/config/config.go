package config

import (
	"os"
	"strings"
)

type Config struct {
	Port           string
	KafkaBroker    string
	KafkaAPIKey    string
	KafkaAPISecret string
	KafkaTopic     string
	KafkaGroupID   string
	OTLPEndpoint   string
	CORSOrigins    []string
}

func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "6016"), // Changed from 6006 to avoid conflict
		KafkaBroker:    getEnv("KAFKA_BROKER_URL", "localhost:9092"),
		KafkaAPIKey:    getEnv("KAFKA_API_KEY", ""),
		KafkaAPISecret: getEnv("KAFKA_API_SECRET", ""),
		KafkaTopic:     getEnv("KAFKA_TOPIC", "logs"),
		KafkaGroupID:   getEnv("KAFKA_GROUP_ID", "log-events-group-go"), // Different from TypeScript version
		OTLPEndpoint:   getEnv("OTLP_ENDPOINT", "localhost:4317"),
		CORSOrigins:    getCORSOrigins(),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getCORSOrigins() []string {
	origins := []string{
		getEnv("FRONTEND_URL", "http://localhost:3000"),
		getEnv("FRONTEND_SELLER_URL", "http://localhost:3001"),
		getEnv("FRONTEND_ADMIN_URL", "http://localhost:3002"),
	}

	// Filter out empty strings
	var filtered []string
	for _, origin := range origins {
		if strings.TrimSpace(origin) != "" {
			filtered = append(filtered, origin)
		}
	}

	return filtered
}
