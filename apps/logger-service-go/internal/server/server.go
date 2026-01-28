package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/eshop/logger-service-go/internal/websocket"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Server wraps the HTTP server
type Server struct {
	router *gin.Engine
	server *http.Server
	hub    *websocket.Hub
}

// NewServer creates a new HTTP server
func NewServer(port string, corsOrigins []string, hub *websocket.Hub) *Server {
	// Set Gin to release mode in production
	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	// CORS middleware
	config := cors.Config{
		AllowOrigins:     corsOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(config))

	// Routes
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to log service (Go)!",
		})
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"clients": hub.ClientCount(),
		})
	})

	// WebSocket endpoint
	router.GET("/ws", func(c *gin.Context) {
		websocket.ServeWs(hub, c.Writer, c.Request)
	})

	server := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	return &Server{
		router: router,
		server: server,
		hub:    hub,
	}
}

// Start starts the HTTP server
func (s *Server) Start() error {
	log.Printf("Starting HTTP server on %s", s.server.Addr)

	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}

// Shutdown gracefully shuts down the server
func (s *Server) Shutdown(ctx context.Context) error {
	log.Println("Shutting down HTTP server...")
	return s.server.Shutdown(ctx)
}
