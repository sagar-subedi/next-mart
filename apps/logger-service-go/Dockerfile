# Multi-stage build for Go logger service

# Builder stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

WORKDIR /app

# Copy go mod files
COPY apps/logger-service-go/go.mod apps/logger-service-go/go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY apps/logger-service-go/ ./

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o logger-service ./cmd/main.go

# Runtime stage
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy binary from builder
COPY --from=builder /app/logger-service .

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 6006

CMD ["./logger-service"]
