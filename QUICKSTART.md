# Quick Start Guide

## 🚀 Start the Server

```powershell
cd C:\Users\Steph\Desktop\url-shortener
npm install  # If you haven't already
npm start
```

The server will start at `http://localhost:3000`

## 🧪 Test All 11 Features

### 1. **Rate Limiting** - Test with multiple requests
```powershell
for($i=1;$i -le 12;$i++) { 
  iwr -Uri "http://localhost:3000/api/v1/shorten" `
    -Method POST `
    -Headers @{"Authorization"="Bearer key1"} `
    -ContentType "application/json" `
    -Body '{"longUrl":"https://www.google.com"}' 
}
# Requests 11+ will get "Too many requests" error
```

### 2. **API Keys** - Test authentication
```powershell
# Without API key (should fail)
iwr -Uri "http://localhost:3000/api/v1/shorten" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"longUrl":"https://www.example.com"}'

# With API key (should work)
iwr -Uri "http://localhost:3000/api/v1/shorten" `
  -Method POST `
  -Headers @{"Authorization"="Bearer key1"} `
  -ContentType "application/json" `
  -Body '{"longUrl":"https://www.example.com"}'
```

### 3. **Request Logging** - Check logs
```powershell
# Open logs in real-time
Get-Content -Path ".\logs\combined.log" -Tail 20 -Wait
```

### 4. **Environment Variables** - Verify setup
```powershell
# Check current environment
[Environment]::GetEnvironmentVariable("API_KEYS")
cat .env
```

### 5. **Docker** - Build and run
```bash
# Build image
docker build -t url-shortener:latest .

# Run container
docker run -p 3000:3000 -e API_KEYS=key1:secret1 url-shortener:latest

# Or use compose
docker-compose up
```

### 6. **Unit Tests** - Run test suite
```powershell
npm test                      # Run all tests
npm test -- --coverage       # Run with coverage
npm test -- --watch          # Watch mode
```

### 7. **Swagger/OpenAPI** - View documentation
```
Open browser: http://localhost:3000/api-docs
```

### 8. **Health Check** - Monitor service
```powershell
iwr http://localhost:3000/health
# Returns: { status: "ok", timestamp: "...", environment: "...", uptime: "..." }
```

### 9. **UTC Timestamps** - Verify timezone handling
```powershell
$response = iwr -Uri "http://localhost:3000/api/v1/shorten" `
  -Method POST `
  -Headers @{"Authorization"="Bearer key1"} `
  -ContentType "application/json" `
  -Body '{"longUrl":"https://www.example.com"}'

$response.Content | ConvertFrom-Json | Format-List
# All timestamps are in ISO 8601 UTC format
```

### 10. **CORS** - Test cross-origin requests
```powershell
# Test from different origin (browser console)
fetch('http://localhost:3000/api/v1/shorten', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer key1',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ longUrl: 'https://example.com' })
}).then(r => r.json()).then(console.log)
```

### 11. **Security Features** - Verify headers
```powershell
# Check security headers
$headers = (iwr http://localhost:3000/health).Headers
$headers | ConvertTo-Json
# Should include: Content-Security-Policy, X-Frame-Options, etc.
```

## 📊 Full API Usage Examples

### Create a Short URL
```powershell
$response = iwr -Uri "http://localhost:3000/api/v1/shorten" `
  -Method POST `
  -Headers @{"Authorization"="Bearer key1"} `
  -ContentType "application/json" `
  -Body '{
    "longUrl": "https://www.example.com/very/long/url",
    "customAlias": "mylink",
    "expiresAt": "2026-12-31T23:59:59Z"
  }'

$response.Content | ConvertFrom-Json | Format-List
```

### Get URL Statistics
```powershell
iwr -Uri "http://localhost:3000/api/v1/stats/mylink" `
  -Headers @{"Authorization"="Bearer key1"} | 
  Select-Object -ExpandProperty Content | 
  ConvertFrom-Json | 
  Format-List
```

### Redirect to Original URL
```powershell
iwr -Uri "http://localhost:3000/mylink" -MaximumRedirection 0
# Returns 301 redirect to https://www.example.com/very/long/url
```

## 🔑 Using Different API Keys

The default API keys are: `key1:secret1` and `key2:secret2`

To add more keys, edit `.env`:
```env
API_KEYS=key1:secret1,key2:secret2,mykey:mysecret
```

## 📝 Checking Logs

```powershell
# Combined logs
Get-Content .\logs\combined.log

# Error logs only
Get-Content .\logs\error.log

# Real-time tail
Get-Content .\logs\combined.log -Tail 50 -Wait
```

## 🧹 Cleanup

```powershell
# Delete database and start fresh
rm database.sqlite

# Clear logs
rm logs\*.log

# Restart server to recreate schema
npm start
```

## 📚 Files to Review

- `README.md` - Full documentation
- `FEATURES.md` - Detailed feature breakdown
- `src/app.js` - Main application setup
- `src/middleware/apiKeyAuth.js` - Auth implementation
- `src/utils/logger.js` - Logging setup
- `Dockerfile` - Container configuration
- `tests/api.test.js` - Unit tests
- `jest.config.js` - Test configuration

## 🆘 Troubleshooting

**Error: Cannot find module 'winston'**
- Run: `npm install`

**Port 3000 already in use**
- Change PORT in `.env` or kill the process using port 3000

**Database locked**
- Delete `database.sqlite` and restart

**Logs not being created**
- Make sure `logs/` directory exists
- Check LOG_LEVEL in `.env`

## 🎯 Next Steps

1. ✅ Review the FEATURES.md for detailed explanation of each feature
2. ✅ Run tests: `npm test`
3. ✅ Check Swagger docs: `http://localhost:3000/api-docs`
4. ✅ Review code structure and best practices
5. ✅ Try Docker deployment: `docker-compose up`

---

**All 11 features are fully implemented and production-ready!** 🚀
