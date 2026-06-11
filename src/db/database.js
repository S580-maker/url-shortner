const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortCode TEXT UNIQUE NOT NULL,
      longUrl TEXT NOT NULL,
      customAlias TEXT UNIQUE,
      expiresAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortCode TEXT NOT NULL,
      clickedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip TEXT,
      referrer TEXT,
      userAgent TEXT,
      FOREIGN KEY (shortCode) REFERENCES urls(shortCode)
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_urls_shortcode ON urls(shortCode)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_clicks_shortcode ON clicks(shortCode)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_clicks_createdat ON clicks(clickedAt)`);
});

// Utility to get current UTC timestamp
db.getCurrentUTCTimestamp = () => {
  return new Date().toISOString();
};

module.exports = db;
