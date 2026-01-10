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
		Port:                     getEnv("PORT", "8081"), // Default to 8081 to run parallel to existing gateway (8080)
		AuthServiceURL:           getServiceURL("auth", "6001"),
		ProductServiceURL:        getServiceURL("product", "6002"),
		OrderServiceURL:          getServiceURL("order", "6003"),
		AdminServiceURL:          getServiceURL("admin", "6004"),
		ChatServiceURL:           getServiceURL("chat", "6005"),
		LoggerServiceURL:         getServiceURL("logger", "6006"),
		RecommendationServiceURL: getServiceURL("recommendation", "6007"),
		SellerServiceURL:         getServiceURL("seller", "6008"),
		KafkaServiceURL:          getServiceURL("kafka", "6009"),
		CORSOrigins:              getCORSOrigins(),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getServiceURL(serviceName, defaultPort string) string {
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
