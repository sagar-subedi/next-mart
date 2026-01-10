package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// IPRateLimiter manages rate limiters for each IP address
type IPRateLimiter struct {
	ips map[string]*rate.Limiter
	mu  sync.RWMutex
	r   rate.Limit
	b   int
}

// NewIPRateLimiter creates a new IP rate limiter
func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
	i := &IPRateLimiter{
		ips: make(map[string]*rate.Limiter),
		r:   r,
		b:   b,
	}

	// Cleanup old entries periodically to prevent memory leaks
	go func() {
		for {
			time.Sleep(10 * time.Minute)
			i.mu.Lock()
			// Simple cleanup: clear all. A better approach would be LRU or tracking last access.
			// For now, clearing all is safe as clients will just get a new bucket.
			i.ips = make(map[string]*rate.Limiter)
			i.mu.Unlock()
		}
	}()

	return i
}

// GetLimiter returns the rate limiter for the given IP
func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	i.mu.Lock()
	defer i.mu.Unlock()

	limiter, exists := i.ips[ip]
	if !exists {
		limiter = rate.NewLimiter(i.r, i.b)
		i.ips[ip] = limiter
	}

	return limiter
}

// RateLimitMiddleware creates a Gin middleware for rate limiting
func RateLimitMiddleware() gin.HandlerFunc {
	// Limit: 100 requests per 15 minutes (approx 0.11 req/sec)
	// Burst: 100
	// Note: The original TS implementation had 100 req/15min window.
	// rate.Limit is req/sec. 100 / (15 * 60) = 0.111

	limiter := NewIPRateLimiter(rate.Limit(0.12), 100)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		if !limiter.GetLimiter(ip).Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"message": "Too many requests, please try again later.",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
