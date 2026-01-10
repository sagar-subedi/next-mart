# Multi-stage build for Go Kafka Service

# Builder stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
# librdkafka dependencies (for confluent-kafka-go)
RUN apk add --no-cache git gcc musl-dev pkgconf build-base

WORKDIR /app

# Copy go mod files
COPY apps/kafka-service-go/go.mod apps/kafka-service-go/go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY apps/kafka-service-go/ ./

# Build the application
# CGO_ENABLED=1 is required for confluent-kafka-go
RUN CGO_ENABLED=1 GOOS=linux go build -tags musl -o kafka-service ./cmd/main.go

# Runtime stage
FROM alpine:latest

# Install ca-certificates for HTTPS and librdkafka dependencies
RUN apk --no-cache add ca-certificates libstdc++

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy binary from builder
COPY --from=builder /app/kafka-service .

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

CMD ["./kafka-service"]
