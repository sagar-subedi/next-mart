package otel

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

// Logger wraps HTTP-based log forwarding to Loki
type Logger struct {
	endpoint string
	client   *http.Client
}

// NewLogger creates a new logger that forwards to Loki via HTTP
func NewLogger(endpoint string) (*Logger, error) {
	// For now, we'll use simple HTTP forwarding to Loki
	// In production, you'd use the OTLP exporter when it's stable

	log.Println("Logger initialized (HTTP forwarding mode)")

	return &Logger{
		endpoint: endpoint,
		client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}, nil
}

// LogFromJSON parses and logs a JSON log message
func (l *Logger) LogFromJSON(logData []byte) {
	var data map[string]interface{}

	// Try to parse as JSON
	if err := json.Unmarshal(logData, &data); err != nil {
		// If not JSON, log as plain text
		l.Info(string(logData), nil)
		return
	}

	// Extract log level
	level := "info"
	if lvl, ok := data["level"].(string); ok {
		level = lvl
	}

	// Extract message
	message := ""
	if msg, ok := data["message"].(string); ok {
		message = msg
	} else {
		message = string(logData)
	}

	log.Printf("Logged [%s]: %s", strings.ToUpper(level), message)

	// In a production setup, you would forward this to Loki here
	// For now, we just log to console
}

// Trace logs a trace message
func (l *Logger) Trace(message string, attributes map[string]interface{}) {
	log.Printf("[TRACE] %s", message)
}

// Debug logs a debug message
func (l *Logger) Debug(message string, attributes map[string]interface{}) {
	log.Printf("[DEBUG] %s", message)
}

// Info logs an info message
func (l *Logger) Info(message string, attributes map[string]interface{}) {
	log.Printf("[INFO] %s", message)
}

// Warn logs a warning message
func (l *Logger) Warn(message string, attributes map[string]interface{}) {
	log.Printf("[WARN] %s", message)
}

// Error logs an error message
func (l *Logger) Error(message string, attributes map[string]interface{}) {
	log.Printf("[ERROR] %s", message)
}

// Fatal logs a fatal message
func (l *Logger) Fatal(message string, attributes map[string]interface{}) {
	log.Printf("[FATAL] %s", message)
}

// Shutdown gracefully shuts down the logger
func (l *Logger) Shutdown() error {
	log.Println("Logger shutdown")
	return nil
}
