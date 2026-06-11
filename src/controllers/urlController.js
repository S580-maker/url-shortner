const crypto = require('crypto');
const db = require('../db/database');
const logger = require('../utils/logger');

function generateShortCode() {
  return crypto.randomBytes(4).toString('hex');
}

async function createShortUrl(longUrl, customAlias = null, expiresAt = null) {
  if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
    throw new Error('Invalid URL format');
  }

  let shortCode = customAlias;

  if (!shortCode) {
    shortCode = generateShortCode();

    const exists = await new Promise((resolve) => {
      db.get('SELECT 1 FROM urls WHERE shortCode = ?', [shortCode], (err, row) => {
        resolve(row);
      });
    });

    if (exists) {
      shortCode = generateShortCode();
    }
  } else {
    const exists = await new Promise((resolve) => {
      db.get(
        'SELECT 1 FROM urls WHERE shortCode = ? OR customAlias = ?',
        [shortCode, shortCode],
        (err, row) => {
          resolve(row);
        }
      );
    });

    if (exists) {
      throw new Error('Custom alias already taken');
    }
  }

  await new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO urls (shortCode, longUrl, customAlias, expiresAt) VALUES (?, ?, ?, ?)',
      [shortCode, longUrl, customAlias, expiresAt],
      function (err) {
        if (err) reject(err);
        resolve(this.lastID);
      }
    );
  });

  return {
    shortCode,
    shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`,
    expiresAt,
  };
}

async function getLongUrlAndRecordClick(shortCode, ip, referrer) {
  const url = await new Promise((resolve, reject) => {
    db.get(
      'SELECT longUrl, expiresAt FROM urls WHERE shortCode = ?',
      [shortCode],
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });

  if (!url) {
    throw new Error('Not found');
  }

  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    throw new Error('Expired');
  }

  db.run(
    'INSERT INTO clicks (shortCode, ip, referrer) VALUES (?, ?, ?)',
    [shortCode, ip, referrer]
  );

  return url.longUrl;
}

// Express middleware handlers
exports.shorten = async (req, res, next) => {
  try {
    const { longUrl, customAlias, expiresAt } = req.body;
    const result = await createShortUrl(longUrl, customAlias, expiresAt);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    console.log('Redirect request for shortCode:', shortCode);
    
    const ip = req.ip;
    const referrer = req.get('referrer') || '';
    
    const longUrl = await getLongUrlAndRecordClick(shortCode, ip, referrer);
    console.log('Found URL, redirecting to:', longUrl);
    res.redirect(301, longUrl);
  } catch (err) {
    console.error('Redirect error:', err.message);
    if (err.message === 'Not found') {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    if (err.message === 'Expired') {
      return res.status(410).json({ error: 'Short URL has expired' });
    }
    next(err);
  }
};