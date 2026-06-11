const request = require('supertest');
const app = require('../src/app');

describe('URL Shortener API', () => {
  
  describe('POST /api/v1/shorten', () => {
    it('should create a shortened URL', async () => {
      const res = await request(app)
        .post('/api/v1/shorten')
        .set('Authorization', 'Bearer key1')
        .send({ longUrl: 'https://www.example.com' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('shortCode');
      expect(res.body).toHaveProperty('shortUrl');
      expect(res.body).toHaveProperty('createdAt');
    });

    it('should reject requests without API key', async () => {
      const res = await request(app)
        .post('/api/v1/shorten')
        .send({ longUrl: 'https://www.example.com' });

      expect(res.status).toBe(401);
    });

    it('should reject invalid URLs', async () => {
      const res = await request(app)
        .post('/api/v1/shorten')
        .set('Authorization', 'Bearer key1')
        .send({ longUrl: 'not-a-url' });

      expect(res.status).toBe(400);
    });

    it('should reject missing longUrl', async () => {
      const res = await request(app)
        .post('/api/v1/shorten')
        .set('Authorization', 'Bearer key1')
        .send({});

      expect(res.status).toBe(400);
    });

    it('should support custom aliases', async () => {
      const res = await request(app)
        .post('/api/v1/shorten')
        .set('Authorization', 'Bearer key1')
        .send({ 
          longUrl: 'https://www.example.com',
          customAlias: 'mycustom'
        });

      expect(res.status).toBe(201);
      expect(res.body.shortCode).toBe('mycustom');
    });

    it('should support expiration dates', async () => {
      const expiresAt = new Date(Date.now() + 86400000).toISOString();
      const res = await request(app)
        .post('/api/v1/shorten')
        .set('Authorization', 'Bearer key1')
        .send({ 
          longUrl: 'https://www.example.com',
          expiresAt
        });

      expect(res.status).toBe(201);
      expect(res.body.expiresAt).toBe(expiresAt);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('environment');
    });
  });

  describe('GET /api-docs', () => {
    it('should return Swagger UI', async () => {
      const res = await request(app)
        .get('/api-docs/');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /:shortCode', () => {
    it('should handle 404 for non-existent short codes', async () => {
      const res = await request(app)
        .get('/nonexistent123')
        .redirects(0);

      expect(res.status).toBe(404);
    });
  });
});
