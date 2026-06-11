const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const statsController = require('../controllers/statsController');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/shorten', rateLimiter, urlController.shorten);
router.get('/stats/:shortCode', statsController.getStats);

module.exports = router;