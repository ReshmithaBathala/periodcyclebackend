const db = require("../db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period_length INTEGER,
      last_period_date TEXT,
      condition TEXT
    )
  `);
});
