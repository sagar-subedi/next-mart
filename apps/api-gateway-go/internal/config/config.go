package config

import (
	"os"
	"strings"
)

type Config struct {
	Port                     string
	AuthServiceURL           string
	ProductServiceURL        string
	OrderServiceURL          string
	AdminServiceURL          string
	ChatServiceURL           string
	LoggerServiceURL         string
	RecommendationServiceURL string
	SellerServiceURL         string
	KafkaServiceURL          string
	CORSOrigins              []string
}

func Load() *Config {
	return &Config{
		Port:                     getEnv("PORT", "8080"), // Default to 8081 to run parallel to existing gateway (8080)
		AuthServiceURL:           getServiceURL("AUTH_SERVICE_URL", "auth", "6001"),
		ProductServiceURL:        getServiceURL("PRODUCT_SERVICE_URL", "product", "6002"),
		OrderServiceURL:          getServiceURL("ORDER_SERVICE_URL", "order", "6003"),
		AdminServiceURL:          getServiceURL("ADMIN_SERVICE_URL", "admin", "6004"),
		ChatServiceURL:           getServiceURL("CHAT_SERVICE_URL", "chat", "6005"),
		LoggerServiceURL:         getServiceURL("LOGGER_SERVICE_URL", "logger", "6006"),
		RecommendationServiceURL: getServiceURL("RECOMMENDATION_SERVICE_URL", "recommendation", "6007"),
		SellerServiceURL:         getServiceURL("SELLER_SERVICE_URL", "seller", "6008"),
		KafkaServiceURL:          getServiceURL("KAFKA_SERVICE_URL", "kafka", "6009"),
		CORSOrigins:              getCORSOrigins(),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getServiceURL(envKey, serviceName, defaultPort string) string {
	// Check for explicit environment variable override first
	if value := os.Getenv(envKey); value != "" {
		return value
	}

	// Check if running locally or in docker
	if os.Getenv("NODE_ENV") == "local" {
		return "http://localhost:" + defaultPort
	}
	// In Docker, use service name
	return "http://" + serviceName + "-service:" + defaultPort
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
