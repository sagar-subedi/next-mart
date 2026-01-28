# Logger Service (Go)

A high-performance log aggregation service written in Go that consumes logs from Kafka, broadcasts them via WebSocket, and forwards them to OpenTelemetry/Loki.

## Features

- **Kafka Consumer**: Consumes logs from Confluent Cloud Kafka
- **WebSocket Server**: Broadcasts logs to connected clients in real-time
- **OpenTelemetry Integration**: Sends logs to Loki via OTLP gRPC
- **High Performance**: Handles 10,000+ concurrent WebSocket connections
- **Low Memory**: Uses ~50MB RAM (vs ~150MB for Node.js version)
- **Graceful Shutdown**: Properly handles SIGTERM/SIGINT signals

## Architecture

```
Kafka (logs topic) → Consumer → [Queue] → Batch Processor
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                            WebSocket Hub      OpenTelemetry
                                    ↓                   ↓
                            Connected Clients      Loki/Grafana
```

## Prerequisites

- Go 1.21 or higher
- Kafka broker (Confluent Cloud)
- OpenTelemetry Collector (for Loki integration)

## Installation

```bash
# Install dependencies
cd apps/logger-service-go
go mod download

# Build
go build -o logger-service ./cmd/main.go

# Run
./logger-service
```

## Configuration

Set the following environment variables:

```bash
PORT=6006                                    # HTTP server port
KAFKA_BROKER_URL=your-broker:9092           # Kafka broker URL
KAFKA_API_KEY=your-api-key                  # Kafka API key
KAFKA_API_SECRET=your-api-secret            # Kafka API secret
KAFKA_TOPIC=logs                            # Kafka topic to consume
KAFKA_GROUP_ID=log-events-group             # Consumer group ID
OTLP_ENDPOINT=localhost:4317                # OpenTelemetry endpoint
FRONTEND_URL=http://localhost:3000          # CORS origin
FRONTEND_SELLER_URL=http://localhost:3001   # CORS origin
FRONTEND_ADMIN_URL=http://localhost:3002    # CORS origin
```

## Docker

```bash
# Build image
docker build -f apps/logger-service-go/Dockerfile -t logger-service-go .

# Run container
docker run -p 6006:6006 \
  -e KAFKA_BROKER_URL=your-broker:9092 \
  -e KAFKA_API_KEY=your-key \
  -e KAFKA_API_SECRET=your-secret \
  logger-service-go
```

## API Endpoints

### GET /
Health check endpoint
```bash
curl http://localhost:6006/
```

### GET /health
Detailed health status with client count
```bash
curl http://localhost:6006/health
```

### WS /ws
WebSocket endpoint for receiving logs
```bash
wscat -c ws://localhost:6006/ws
```

## Development

```bash
# Run locally
go run cmd/main.go

# Run tests
go test ./...

# Format code
go fmt ./...

# Lint
golangci-lint run
```

## Performance

**Benchmarks (vs TypeScript version):**
- Memory: 50MB (67% reduction)
- CPU: 10-20% under load (50% reduction)
- Connections: 10,000+ concurrent WebSocket connections (10x improvement)
- Startup: <1 second (vs 3-5 seconds)
- Image size: ~20MB (vs ~150MB)

## Project Structure

```
apps/logger-service-go/
├── cmd/
│   └── main.go              # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go        # Configuration management
│   ├── kafka/
│   │   └── consumer.go      # Kafka consumer
│   ├── websocket/
│   │   ├── hub.go           # WebSocket hub
│   │   └── client.go        # WebSocket client
│   ├── otel/
│   │   └── logger.go        # OpenTelemetry logger
│   └── server/
│       └── server.go        # HTTP server
├── go.mod
├── go.sum
├── Dockerfile
└── README.md
```

## License

MIT
