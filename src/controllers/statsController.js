const db = require('../db/database');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/v1/stats/{shortCode}:
 *   get:
 *     summary: Get statistics for a shortened URL
 *     tags: [Stats]
 *     parameters:
 *       - name: shortCode
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The short code of the URL
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       404:
 *         description: Short URL not found
 */
exports.getStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    
    logger.debug(`Fetching stats for shortCode: ${shortCode}`);
    
    const url = await new Promise((resolve, reject) => {
      db.get('SELECT longUrl, createdAt, expiresAt FROM urls WHERE shortCode = ?', [shortCode], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    
    if (!url) {
      logger.warn(`Stats request for non-existent shortCode: ${shortCode}`);
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    const clickCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM clicks WHERE shortCode = ?', [shortCode], (err, row) => {
        if (err) reject(err);
        resolve(row.count);
      });
    });

    const stats = {
      shortCode,
      longUrl: url.longUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      totalClicks: clickCount,
      fetchedAt: new Date().toISOString(),
    };

    logger.info(`Stats retrieved for ${shortCode}: ${clickCount} clicks`);
    res.json(stats);
  } catch (err) {
    logger.error(`Error fetching stats: ${err.message}`);
    next(err);
  }
};