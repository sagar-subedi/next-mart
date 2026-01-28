package proxy

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

// NewReverseProxy creates a reverse proxy handler for a given target URL
// stripPrefix is optional. If provided, it will be removed from the request path before proxying.
func NewReverseProxy(target string, stripPrefix string) gin.HandlerFunc {
	url, err := url.Parse(target)
	if err != nil {
		log.Fatalf("Failed to parse proxy target URL: %v", err)
	}

	proxy := httputil.NewSingleHostReverseProxy(url)

	// Custom director to set headers if needed
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Header.Set("X-Forwarded-Host", req.Header.Get("Host"))

		// Strip prefix if configured
		if stripPrefix != "" {
			// Handle both Path and RawPath
			req.URL.Path = strings.TrimPrefix(req.URL.Path, stripPrefix)
			if req.URL.RawPath != "" {
				req.URL.RawPath = strings.TrimPrefix(req.URL.RawPath, stripPrefix)
			}
		}

		// Debug logging
		// log.Printf("Proxying request: %s %s -> %s%s", req.Method, req.RequestURI, url.String(), req.URL.Path)
	}

	// Modify response to strip downstream CORS headers
	proxy.ModifyResponse = func(resp *http.Response) error {
		resp.Header.Del("Access-Control-Allow-Origin")
		resp.Header.Del("Access-Control-Allow-Credentials")
		resp.Header.Del("Access-Control-Allow-Methods")
		resp.Header.Del("Access-Control-Allow-Headers")
		return nil
	}

	return func(c *gin.Context) {
		proxy.ServeHTTP(c.Writer, c.Request)
	}
}
