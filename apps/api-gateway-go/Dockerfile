# Multi-stage build for Go API Gateway

# Builder stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

WORKDIR /app

# Copy go mod files
COPY apps/api-gateway-go/go.mod apps/api-gateway-go/go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY apps/api-gateway-go/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o api-gateway ./cmd/main.go

# Runtime stage
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy binary from builder
COPY --from=builder /app/api-gateway .

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8081

CMD ["./api-gateway"]
