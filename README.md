# DokoMart: Modern E-commerce Platform

<div align="center">
  <h3>A Full-Stack E-commerce Solution with Polyglot Microservices Architecture</h3>
  <p>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

## 🌟 Features

- **Multi-UI System**
  - 🛍️ User Interface (Next.js)
  - 🏪 Seller Dashboard (Next.js)
  - 👨‍💼 Admin Dashboard (Next.js)
  - Modern, responsive design with Tailwind CSS

- **Authentication & Authorization**
  - 🔐 Secure user authentication
  - 🔑 JWT with refresh token mechanism
  - 📧 Email verification system
  - 🔄 Password reset functionality
  - 👥 Role-based access control (Users/Sellers/Admins)

- **Payment Integration**
  - 💳 Stripe Connect for seller payments
  - 🏦 Secure payment processing
  - 💰 Multi-currency support

- **Real-time Features**
  - 💬 Live chat system
  - 📊 Real-time analytics
  - 🔔 Push notifications

- **Advanced Capabilities**
  - 🤖 AI-powered product recommendations (TensorFlow)
  - 📈 Comprehensive observability stack
  - 🔄 Event-driven architecture with Kafka
  - 📦 Distributed logging and tracing

## 🏗️ Microservices Architecture

DokoMart implements a **polyglot microservices architecture**, leveraging the best language for each service:

### Service Landscape

| Service | Language | Port | Description |
|---------|----------|------|-------------|
| **API Gateway** | ![Go](https://img.shields.io/badge/-Go-00ADD8?style=flat&logo=go&logoColor=white) | 8080 | Unified entry point with routing & CORS |
| **Auth Service** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 6001 | User authentication & authorization |
| **Product Service** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 6002 | Product catalog management |
| **Order Service** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 6003 | Order processing & fulfillment |
| **Admin Service** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 6004 | Admin operations & site config |
| **Chat Service** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 6005 | Real-time messaging |
| **Logger Service** | ![Go](https://img.shields.io/badge/-Go-00ADD8?style=flat&logo=go&logoColor=white) | 6006 | Centralized logging with WebSocket |
| **Recommendation Service** | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white) | 6007 | ML-based product recommendations |
| **Seller Service** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 6008 | Seller management & operations |
| **Kafka Service** | ![Go](https://img.shields.io/badge/-Go-00ADD8?style=flat&logo=go&logoColor=white) | 6009 | Event streaming & message broker |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
├──────────────┬──────────────┬──────────────────────────────────┤
│   User UI    │  Seller UI   │         Admin UI                 │
│  (Next.js)   │  (Next.js)   │        (Next.js)                 │
│   :3000      │   :3001      │         :3002                    │
└──────┬───────┴──────┬───────┴──────────┬───────────────────────┘
       │              │                  │
       └──────────────┴──────────────────┘
                      │
       ┌──────────────▼──────────────────────────────────────────┐
       │          API Gateway (Go) :8080                         │
       │  • Request Routing  • CORS  • Rate Limiting             │
       └──────────────┬──────────────────────────────────────────┘
                      │
       ┌──────────────┴──────────────────────────────────────────┐
       │                  Service Layer                          │
       ├──────────┬──────────┬──────────┬──────────┬────────────┤
       │   Auth   │ Product  │  Order   │  Admin   │   Chat     │
       │   :6001  │  :6002   │  :6003   │  :6004   │   :6005    │
       ├──────────┼──────────┼──────────┼──────────┼────────────┤
       │  Logger  │  Recom.  │  Seller  │  Kafka   │            │
       │  :6006   │  :6007   │  :6008   │  :6009   │            │
       └──────────┴──────────┴──────────┴──────────┴────────────┘
                      │
       ┌──────────────┴──────────────────────────────────────────┐
       │                  Data Layer                             │
       ├──────────────────────┬──────────────────────────────────┤
       │  MongoDB (Prisma)    │         Redis Cache              │
       └──────────────────────┴──────────────────────────────────┘
```

## 📊 Observability Stack

DokoMart includes a comprehensive observability solution for monitoring, logging, and tracing:

### Components

- **Grafana** - Visualization and dashboards
- **Loki** - Log aggregation
- **Promtail** - Log collection agent
- **Tempo** - Distributed tracing
- **Prometheus** - Metrics collection
- **OpenTelemetry Collector** - Telemetry data pipeline

### Features

- 📈 Real-time metrics and dashboards
- 🔍 Distributed request tracing
- 📝 Centralized log aggregation
- 🚨 Alerting and monitoring
- 📊 Service performance analytics

Access Grafana at `http://localhost:3100` after running the observability stack.

## 🚀 Technology Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Query**
- **Zustand** (State Management)

### Backend Services
- **Node.js/Express** (TypeScript services)
- **Go** (High-performance services)
- **Python/FastAPI** (ML services)
- **Prisma** (ORM)
- **Redis** (Caching)
- **MongoDB** (Database)

### Infrastructure
- **Nx** (Monorepo)
- **Docker & Docker Compose**
- **Kafka** (Event Streaming)
- **OpenTelemetry** (Observability)

### ML/AI
- **TensorFlow** (Recommendation Engine)
- **NumPy** (Data Processing)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Python 3.10+ (for recommendation service)
- Go 1.21+ (for Go services)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/dokomart.git
   cd dokomart
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start with Docker Compose**

   ```bash
   # Start all services (TypeScript only)
   docker compose -f docker-compose.dev.yml up -d

   # Start polyglot services (includes Go & Python)
   docker compose -f docker-compose.dev-polyglot.yml up -d

   # Start with observability stack
   docker compose -f docker-compose.dev.yml -f docker-compose.observability.yml up -d
   ```

5. **Development mode (without Docker)**

   ```bash
   # Start all services
   npm run dev

   # Start specific UI
   npm run user    # User interface
   npm run seller  # Seller dashboard
   npm run admin   # Admin dashboard
   ```

### Service URLs

- **User UI**: http://localhost:3000
- **Seller UI**: http://localhost:3001
- **Admin UI**: http://localhost:3002
- **API Gateway**: http://localhost:8080
- **Grafana**: http://localhost:3100

## 📁 Project Structure

```
dokomart/
├── apps/
│   ├── api-gateway-go/              # Go-based API Gateway
│   ├── auth-service/                # Authentication service (TS)
│   ├── product-service/             # Product management (TS)
│   ├── order-service/               # Order processing (TS)
│   ├── admin-service/               # Admin operations (TS)
│   ├── chatting-service/            # Real-time chat (TS)
│   ├── logger-service-go/           # Logging service (Go)
│   ├── recommendation-service-python/ # ML recommendations (Python)
│   ├── seller-service/              # Seller management (TS)
│   ├── kafka-service-go/            # Event streaming (Go)
│   ├── user-ui/                     # Customer frontend (Next.js)
│   ├── seller-ui/                   # Seller dashboard (Next.js)
│   └── admin-ui/                    # Admin dashboard (Next.js)
├── packages/
│   ├── error-handler/               # Shared error handling
│   └── libs/
│       ├── prisma/                  # Database access layer
│       ├── redis/                   # Caching layer
│       └── imageKit/                # Image management
├── config/                          # Observability configs
│   ├── grafana/
│   ├── loki/
│   ├── promtail/
│   └── tempo/
└── prisma/
    └── schema.prisma                # Database schema
```

## 🧪 Testing

```bash
# Run all tests
npx nx run-many --target=test --all

# Test specific service
npx nx test auth-service
npx nx test product-service
```

## 📚 Documentation

- **API Documentation**: Available at `/api/docs` (Swagger UI)
- **Service-specific READMEs**: Each microservice contains detailed documentation
- **Architecture Decisions**: See `/docs` folder (if available)

## 🔧 Development

### Adding a New Service

1. Create service directory in `apps/`
2. Add service configuration to `docker-compose.dev-polyglot.yml`
3. Update API Gateway routing in `apps/api-gateway-go/`
4. Add service to Nx workspace configuration

### Environment Variables

Key environment variables:
- `DATABASE_URL` - MongoDB connection string
- `REDIS_DATABASE_URI` - Redis connection string
- `KAFKA_BROKER_URL` - Kafka broker URL
- `KAFKA_API_KEY` & `KAFKA_API_SECRET` - Kafka credentials
- `STRIPE_SECRET_KEY` - Stripe API key

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nx](https://nx.dev/) for excellent monorepo tooling
- [Next.js](https://nextjs.org/) for the React framework
- [Stripe](https://stripe.com/) for payment processing
- [Confluent](https://www.confluent.io/) for Kafka platform
- [Grafana Labs](https://grafana.com/) for observability tools

---

<div align="center">
  <p>Built with ❤️ using TypeScript, Go, and Python</p>
</div>
