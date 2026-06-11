# URL Shortener - Features Implementation Summary

## ✅ All 11 Features Implemented

### 1. **Rate Limiting** ✅
- **File**: `src/middleware/rateLimiter.js`
- **Why it matters**: Shows you think about abuse (bots, spam)
- **Configuration**: 10 requests per minute per IP
- **Customizable**: Edit `windowMs` and `max` values
- **Status**: Working with express-rate-limit

### 2. **API Keys** ✅
- **File**: `src/middleware/apiKeyAuth.js`
- **Why it matters**: Shows you understand access control
- **Implementation**: Bearer token authentication
- **Format**: `Authorization: Bearer <api-key>`
- **Configuration**: Set API_KEYS in `.env` file
- **Example**: `API_KEYS=key1:secret1,key2:secret2`
- **Public endpoints**: `/health`, `/api-docs`, `/:shortCode` (no auth needed)

### 3. **Request Logging** ✅
- **File**: `src/utils/logger.js`
- **Why it matters**: Shows you can debug production issues
- **Implementation**: Winston logger with multiple transports
- **Outputs**:
  - Console (colored output for development)
  - `logs/combined.log` (all logs)
  - `logs/error.log` (errors only)
- **Log levels**: error, warn, info, debug
- **Configuration**: Set LOG_LEVEL in `.env`
- **Captured data**: Method, path, status, duration, IP, API key

### 4. **Environment Variables** ✅
- **File**: `.env`, `.env.test`
- **Why it matters**: Shows you know how to handle secrets
- **Configuration management**:
  - PORT, BASE_URL, NODE_ENV
  - LOG_LEVEL, ENABLE_SWAGGER
  - JWT_SECRET, API_KEYS
  - CORS_ORIGINS
- **Security**: Never commit `.env` files
- **Tool**: dotenv package for loading variables

### 5. **Docker** ✅
- **Files**: `Dockerfile`, `docker-compose.yml`, `.dockerignore`
- **Why it matters**: Shows you understand consistent environments
- **Features**:
  - Multi-stage builds for smaller images
  - Non-root user for security
  - Health check endpoint
  - dumb-init for proper signal handling
  - Volume persistence for database and logs
- **Build**: `docker build -t url-shortener:latest .`
- **Run**: `docker run -p 3000:3000 url-shortener:latest`
- **Compose**: `docker-compose up`

### 6. **Unit Tests** ✅
- **Files**: `tests/api.test.js`, `jest.config.js`, `tests/setup.js`
- **Why it matters**: Shows you write reliable code
- **Framework**: Jest with Supertest
- **Coverage**: API endpoints, error handling, auth
- **Run tests**: `npm test`
- **Coverage report**: `npm test -- --coverage`
- **Test cases**:
  - URL shortening (valid/invalid)
  - Custom aliases
  - API key authentication
  - Health checks
  - 404 handling

### 7. **Swagger/OpenAPI** ✅
- **File**: `src/config/swagger.js`
- **Why it matters**: Shows you can document for other devs
- **Features**:
  - Interactive API explorer
  - Live request/response examples
  - Type definitions
  - Authentication documentation
- **Access**: `http://localhost:3000/api-docs`
- **JSON spec**: `http://localhost:3000/api-docs.json`
- **Documented endpoints**: All routes with JSDoc comments
- **Control**: Set ENABLE_SWAGGER in `.env`

### 8. **Health Check Endpoint** ✅
- **Endpoint**: `GET /health`
- **Why it matters**: Shows you think about monitoring
- **Response format**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-06-11T10:12:00.000Z",
    "environment": "development|production",
    "uptime": 1234.5
  }
  ```
- **No authentication**: Public endpoint
- **Docker health check**: Integrated in `Dockerfile`
- **Kubernetes ready**: Can be used as liveness probe

### 9. **Timezone-Aware Timestamps (UTC)** ✅
- **Implementation**: `new Date().toISOString()`
- **Why it matters**: Shows you work globally
- **Timestamps stored as**:
  - `createdAt` - URL creation time
  - `clickedAt` - When URL was accessed
  - `fetchedAt` - When stats were retrieved
- **All times in UTC**: ISO 8601 format
- **Database**: Updated schema with UTC columns
- **Client conversion**: Timestamps returned for client to display in local time

### 10. **CORS Properly Configured** ✅
- **File**: `src/app.js`
- **Why it matters**: Shows you understand web security
- **Configuration**:
  - `origin`: Configurable via CORS_ORIGINS env var
  - `credentials`: true for cookie/auth support
  - `methods`: GET, POST, PUT, DELETE
  - `allowedHeaders`: Content-Type, Authorization
- **Helmet.js**: Additional HTTP headers security
- **Default**: Allows all origins (configurable)
- **Production**: Restrict to specific domains

### 11. **Additional Security Features** 🛡️
- **Input Validation**: URL format checking
- **Error Handling**: Detailed error messages with proper HTTP codes
- **Database Indexing**: Optimized queries for performance
- **Non-root Docker user**: Reduced attack surface
- **JWT Secret**: Available for future token implementation
- **Environment-based logging**: Less verbose in production

## Project Structure

```
url-shortener/
├── src/
│   ├── app.js                      # Express app with all middleware
│   ├── server.js                   # Entry point
│   ├── config/
│   │   └── swagger.js              # OpenAPI/Swagger config
│   ├── controllers/
│   │   ├── urlController.js        # URL shortening + redirect
│   │   └── statsController.js      # Analytics endpoint
│   ├── middleware/
│   │   ├── rateLimiter.js          # Request rate limiting
│   │   └── apiKeyAuth.js           # API key + logging
│   ├── routes/
│   │   └── api.js                  # API route definitions
│   ├── db/
│   │   └── database.js             # SQLite setup + indices
│   ├── services/
│   │   └── urlServices.js          # Business logic
│   └── utils/
│       └── logger.js               # Winston logging setup
├── tests/
│   ├── api.test.js                 # Comprehensive API tests
│   └── setup.js                    # Jest configuration
├── .env                            # Production environment
├── .env.test                       # Test environment
├── .dockerignore                   # Docker build exclusions
├── .gitignore                      # Git exclusions
├── docker-compose.yml              # Multi-container orchestration
├── Dockerfile                      # Container image definition
├── jest.config.js                  # Test runner config
├── package.json                    # Dependencies + scripts
├── README.md                       # Full documentation
└── FEATURES.md                     # This file

```

## Installation & Running

### Local Development
```bash
npm install
npm run dev
# Server runs at http://localhost:3000
```

### Testing
```bash
npm test
npm test -- --coverage
```

### Docker
```bash
docker-compose up
# Server runs at http://localhost:3000
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| BASE_URL | http://localhost:3000 | API base URL |
| NODE_ENV | development | Environment (development/production/test) |
| LOG_LEVEL | info | Logging verbosity (debug/info/warn/error) |
| JWT_SECRET | - | Secret for token signing |
| API_KEYS | - | Bearer tokens (key1:secret1,key2:secret2) |
| ENABLE_SWAGGER | true | Enable /api-docs endpoint |
| CORS_ORIGINS | * | Allowed CORS origins |

## API Examples

### Create Short URL
```bash
curl -X POST http://localhost:3000/api/v1/shorten \
  -H "Authorization: Bearer key1" \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```

### Get Stats
```bash
curl http://localhost:3000/api/v1/stats/abc12345 \
  -H "Authorization: Bearer key1"
```

### Redirect
```bash
curl -L http://localhost:3000/abc12345
```

### Health Check (No Auth)
```bash
curl http://localhost:3000/health
```

### API Docs (No Auth)
```
http://localhost:3000/api-docs
```

## Key Technologies

- **Runtime**: Node.js 20+
- **Framework**: Express 5.2
- **Database**: SQLite3
- **Logging**: Winston 3.11
- **Testing**: Jest 30.4 + Supertest
- **API Docs**: Swagger UI + swagger-jsdoc
- **Security**: Helmet 8.2
- **Rate Limiting**: express-rate-limit 8.5
- **Containerization**: Docker + Docker Compose

## Performance Considerations

- **SQLite**: Good for small-to-medium scale (up to 100K URLs)
- **Database Indices**: Created on shortCode and clickedAt
- **Caching**: Can add Redis for frequent redirects
- **Logging**: Uses file rotation to manage log size
- **Rate Limiting**: Per-IP to prevent abuse

## Deployment Ready ✅

This application is production-ready and demonstrates:
- ✅ Scalable architecture
- ✅ Security best practices
- ✅ Monitoring capabilities
- ✅ Error handling
- ✅ Documentation
- ✅ Testing coverage
- ✅ Docker support
- ✅ Environment management

Perfect for demonstrating engineering excellence in remote technical interviews!

---

**Built with ❤️ by Oboda Steve**
📍 **Location:** Ghana
📧 **Contact:** obodaisteve@gmail.com
