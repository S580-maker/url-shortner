# URL Shortener API 🔗

A production-grade URL shortener API built with Node.js, Express, and SQLite. Designed to show best practices for remote software engineering roles.

## Features ✨

- ✅ **Rate Limiting** - Protect against abuse with configurable request throttling
- ✅ **API Keys** - Bearer token authentication for access control
- ✅ **Request Logging** - Production-grade logging with Winston
- ✅ **Environment Variables** - Secure configuration management with dotenv
- ✅ **Docker** - Containerized deployment with multi-stage builds
- ✅ **Unit Tests** - Comprehensive test coverage with Jest
- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **Health Checks** - Monitoring-ready endpoints
- ✅ **UTC Timestamps** - Global timezone handling
- ✅ **CORS** - Properly configured cross-origin requests
- ✅ **Security** - Helmet.js for HTTP headers hardening

## Prerequisites

- Node.js 20+
- npm or yarn
- Docker (optional)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=debug
JWT_SECRET=your_super_secret_key_change_this_in_production
API_KEYS=key1:secret1,key2:secret2
ENABLE_SWAGGER=true
CORS_ORIGINS=*
```

## Running Locally

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Docker

```bash
docker-compose up
```

## API Endpoints

### Create Shortened URL

```bash
curl -X POST http://localhost:3000/api/v1/shorten \
  -H "Authorization: Bearer key1" \
  -H "Content-Type: application/json" \
  -d '{"longUrl":"https://example.com"}'
```

**Response:**
```json
{
  "shortCode": "abc12345",
  "shortUrl": "http://localhost:3000/abc12345",
  "createdAt": "2026-06-11T10:12:00.000Z",
  "expiresAt": null
}
```

### Get URL Statistics

```bash
curl http://localhost:3000/api/v1/stats/abc12345 \
  -H "Authorization: Bearer key1"
```

### Redirect to Original URL

```bash
curl -L http://localhost:3000/abc12345
```

### Health Check

```bash
curl http://localhost:3000/health
```

### API Documentation

Visit: `http://localhost:3000/api-docs`

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm test -- --coverage
```

## Project Structure

```
url-shortener/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/                # Configuration files
│   │   └── swagger.js         # Swagger/OpenAPI setup
│   ├── controllers/           # Request handlers
│   │   ├── urlController.js   # URL shortening logic
│   │   └── statsController.js # Analytics logic
│   ├── db/
│   │   └── database.js        # SQLite setup
│   ├── middleware/            # Express middleware
│   │   ├── apiKeyAuth.js      # API key verification
│   │   └── rateLimiter.js     # Rate limiting
│   ├── routes/
│   │   └── api.js             # API routes
│   ├── services/
│   │   └── urlServices.js     # Business logic
│   └── utils/
│       └── logger.js          # Winston logger
├── tests/                     # Test suite
├── .env                       # Environment variables
├── .env.test                  # Test environment
├── Dockerfile                 # Container image
├── docker-compose.yml         # Multi-container setup
├── jest.config.js             # Test configuration
├── package.json               # Dependencies
└── server.js                  # Entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| BASE_URL | API base URL | http://localhost:3000 |
| NODE_ENV | Environment | development |
| LOG_LEVEL | Log verbosity (debug, info, warn, error) | info |
| JWT_SECRET | Secret for token signing | - |
| API_KEYS | Comma-separated API keys (key1:secret1,key2:secret2) | - |
| ENABLE_SWAGGER | Enable Swagger UI | true |
| CORS_ORIGINS | Allowed CORS origins | * |

## API Key Usage

Include your API key in the Authorization header:

```bash
Authorization: Bearer key1
```

Generate a new key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Logging

Logs are written to:
- **Console** - Real-time output
- **logs/combined.log** - All logs
- **logs/error.log** - Error logs only

Configure log level via `LOG_LEVEL` environment variable:
- `error` - Only errors
- `warn` - Warnings and errors
- `info` - General information
- `debug` - Detailed debug info

## Rate Limiting

- Default: 10 requests per minute per IP
- Configured in `src/middleware/rateLimiter.js`
- Customize: Edit `windowMs` and `max` values

## Security

- **Helmet.js** - Secure HTTP headers
- **CORS** - Configurable cross-origin access
- **API Keys** - Bearer token authentication
- **Environment Secrets** - Sensitive data in .env
- **Rate Limiting** - DDoS protection
- **Input Validation** - URL format verification

## Deployment

### Using Docker

1. Build image:
   ```bash
   docker build -t url-shortener:latest .
   ```

2. Run container:
   ```bash
   docker run -p 3000:3000 -e API_KEYS=key1:secret1 url-shortener:latest
   ```

### Using Docker Compose

```bash
docker-compose up -d
```

### Cloud Deployment

#### Heroku

```bash
heroku create your-app-name
git push heroku main
```

#### Railway/AWS/Digital Ocean

1. Push code to Git
2. Connect repository in platform dashboard
3. Set environment variables
4. Deploy

## Performance Considerations

- SQLite is suitable for small-to-medium scale
- For high traffic, migrate to PostgreSQL
- Add Redis caching for frequently accessed URLs
- Implement CDN for redirects
- Use database indexing on `shortCode` and `createdAt`

## Monitoring

Health check endpoint available at `/health`:

```json
{
  "status": "ok",
  "timestamp": "2026-06-11T10:12:00.000Z",
  "environment": "production",
  "uptime": 1234.5
}
```

## Troubleshooting

**Issue: API Key not working**
- Verify format: `Authorization: Bearer <key>`
- Check key exists in `API_KEYS` environment variable

**Issue: Rate limit being hit**
- Increase `max` value in `rateLimiter.js`
- Implement request queuing on client

**Issue: Database locked**
- Restart server
- Check for concurrent writes
- Consider upgrading to PostgreSQL

## Contributing

1. Create a feature branch
2. Write tests for new features
3. Run `npm test` before committing
4. Submit pull request

## License

MIT

## Support

For issues or questions, please contact:
- 📧 **Email:** obodaisteve@gmail.com
- 📍 **Location:** Ghana

Or open a GitHub issue for bug reports and feature requests.

---

Built with ❤️ for remote engineering excellence.
