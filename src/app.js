const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes/api');
const urlController = require('./controllers/urlController');
const { apiKeyMiddleware, requestLoggingMiddleware } = require('./middleware/apiKeyAuth');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLoggingMiddleware);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Documentation
if (process.env.ENABLE_SWAGGER !== 'false') {
  app.use('/api-docs', swaggerUI.serve);
  app.get('/api-docs', swaggerUI.setup(swaggerSpec, { 
    swaggerOptions: { url: '/api-docs.json' } 
  }));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// API routes with authentication
app.use('/api/v1', apiKeyMiddleware, apiRoutes);

// Root-level redirect route for short URLs (no auth required)
app.get('/:shortCode', urlController.redirect);

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use((req, res) => {
  logger.warn(`No route matched for ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;