const express = require("express");
const router = express.Router();
const db = require("../db");

// POST user data
router.post("/submit", (req, res) => {
  const { periodLength, lastPeriodDate, condition } = req.body;

  const sql = `
    INSERT INTO user_data (period_length, last_period_date, condition)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [periodLength, lastPeriodDate, condition], function (err) {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    res
      .status(200)
      .json({ message: "Data saved successfully", id: this.lastID });
  });
});

// GET user data
router.get("/data", (req, res) => {
  const sql = "SELECT * FROM user_data ORDER BY last_period_date DESC"; // Get data ordered by date
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    // Transforming the rows into the format the frontend expects
    const responseData = {
      nextPeriod: 28, // Example, you can calculate this based on your data
      cycleInsights: {
        averageLength: 30, // Replace with actual data
        variation: 2,
        periodAverageLength: 5,
        periodVariation: 1,
      },
      mostLoggedSymptom: "Bloating", // Example, you can fetch from symptom data
      history: rows.map((row) => ({
        date: row.last_period_date,
        details: row.condition, // You can modify this as per your schema
      })),
      symptoms: ["Bloating", "Fatigue"], // Example, use actual symptoms from your data
    };

    res.status(200).json(responseData);
  });
});

module.exports = router;
