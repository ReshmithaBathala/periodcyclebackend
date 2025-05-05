const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "user_data.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("Error opening database", err);
  console.log("Connected to SQLite database.");
});

module.exports = db;
