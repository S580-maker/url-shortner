const logger = require('../utils/logger');

/**
 * Parse API keys from environment variables
 * Format: API_KEYS=key1:secret1,key2:secret2
 */
function parseApiKeys() {
  const keysString = process.env.API_KEYS || '';
  const keys = {};
  
  if (keysString) {
    keysString.split(',').forEach(pair => {
      const [key, secret] = pair.trim().split(':');
      if (key && secret) {
        keys[key] = secret;
      }
    });
  }
  
  return keys;
}

const validApiKeys = parseApiKeys();

/**
 * Middleware to validate API keys
 * Expects: Authorization: Bearer <api-key>
 */
const apiKeyMiddleware = (req, res, next) => {
  // Skip API key check for public endpoints
  if (req.path === '/health' || req.path === '/api-docs' || req.path.startsWith('/api-docs/')) {
    return next();
  }

  const authHeader = req.get('Authorization');
  
  if (!authHeader) {
    logger.warn(`API Key missing for ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Missing API key. Use Authorization: Bearer <api-key>' });
  }

  const [scheme, token] = authHeader.split(' ');
  
  if (scheme !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid authorization scheme. Use: Bearer <api-key>' });
  }

  if (!token || !validApiKeys[token]) {
    logger.warn(`Invalid API Key attempt for ${req.method} ${req.path}`);
    return res.status(403).json({ error: 'Invalid or expired API key' });
  }

  // Attach API key info to request
  req.apiKey = token;
  req.apiSecret = validApiKeys[token];
  
  logger.debug(`API Key authenticated: ${token}`);
  next();
};

/**
 * Middleware to log request details
 */
const requestLoggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      apiKey: req.apiKey || 'none',
    };

    if (res.statusCode >= 400) {
      logger.error(`Request failed`, log);
    } else {
      logger.info(`Request completed`, log);
    }

    return originalSend.call(this, data);
  };

  next();
};

module.exports = {
  apiKeyMiddleware,
  requestLoggingMiddleware,
};
