package server

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/eshop/api-gateway-go/internal/config"
	"github.com/eshop/api-gateway-go/internal/middleware"
	"github.com/eshop/api-gateway-go/internal/proxy"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	server *http.Server
	cfg    *config.Config
}

func NewServer(cfg *config.Config) *Server {
	// Set Gin to release mode in production
	// gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	// Apply Middleware
	router.Use(middleware.CORS(cfg.CORSOrigins))
	router.Use(middleware.RateLimitMiddleware())

	// Health Check
	router.GET("/gateway-health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to api-gateway (Go)!",
		})
	})

	// Configure Routes
	// Note: The original gateway uses express-http-proxy which forwards the path.
	// We need to ensure the path is correctly preserved.
	// Gin's wildcard param *path captures the rest of the path.

	// Auth Service
	router.Any("/users/*path", proxy.NewReverseProxy(cfg.AuthServiceURL, "")) // No strip for users? Original: app.use('/', proxy(...auth...)). Wait.
	// Original: app.use('/', proxy(...auth...)) matches everything.
	// But usually specific routes come first.
	// The original gateway didn't have specific /users route. It just fell through to /.
	// So /users went to auth service.
	// If we want to match original behavior, we shouldn't strip /users if it wasn't stripped before.
	// But wait, app.use('/', ...) matches /users and strips /. So it sends /users.
	// Here we match /users/*path. We should probably NOT strip /users if we want it to arrive as /users.
	// But if we want to be safe, let's look at auth service.
	// Let's assume for now we only strip the explicit service prefixes.

	router.Any("/auth/*path", proxy.NewReverseProxy(cfg.AuthServiceURL, "")) // Don't strip /auth?
	// If original was app.use('/', ...), then /auth/login -> /auth/login.
	// So we don't strip.

	// Product Service
	router.Any("/products/*path", proxy.NewReverseProxy(cfg.ProductServiceURL, "/products"))
	router.Any("/products", proxy.NewReverseProxy(cfg.ProductServiceURL, "/products"))

	// Order Service
	router.Any("/orders/*path", proxy.NewReverseProxy(cfg.OrderServiceURL, "/orders"))
	router.Any("/orders", proxy.NewReverseProxy(cfg.OrderServiceURL, "/orders"))

	// Admin Service
	router.Any("/admin/*path", proxy.NewReverseProxy(cfg.AdminServiceURL, "/admin"))
	router.Any("/admin", proxy.NewReverseProxy(cfg.AdminServiceURL, "/admin"))

	// Chat Service
	router.Any("/chats/*path", proxy.NewReverseProxy(cfg.ChatServiceURL, "/chats"))
	router.Any("/chats", proxy.NewReverseProxy(cfg.ChatServiceURL, "/chats"))

	// Logger Service
	router.Any("/logs/*path", proxy.NewReverseProxy(cfg.LoggerServiceURL, "/logs"))
	router.Any("/logs", proxy.NewReverseProxy(cfg.LoggerServiceURL, "/logs"))

	// Recommendation Service
	router.Any("/recommendation/*path", proxy.NewReverseProxy(cfg.RecommendationServiceURL, "/recommendation"))
	router.Any("/recommendation", proxy.NewReverseProxy(cfg.RecommendationServiceURL, "/recommendation"))

	// Seller Service
	router.Any("/seller/*path", proxy.NewReverseProxy(cfg.SellerServiceURL, "/seller"))
	router.Any("/seller", proxy.NewReverseProxy(cfg.SellerServiceURL, "/seller"))

	// Fallback to Auth Service (as per original gateway)
	// We use NoRoute to handle everything else
	router.NoRoute(proxy.NewReverseProxy(cfg.AuthServiceURL, ""))

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	return &Server{
		router: router,
		server: server,
		cfg:    cfg,
	}
}

func (s *Server) Start() error {
	log.Printf("Starting API Gateway on %s", s.server.Addr)
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start server: %w", err)
	}
	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	log.Println("Shutting down API Gateway...")
	return s.server.Shutdown(ctx)
}
