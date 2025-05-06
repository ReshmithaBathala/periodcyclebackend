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
// router.get("/data", (req, res) => {
//   const sql = "SELECT * FROM user_data ORDER BY last_period_date DESC"; // Get data ordered by date
//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       console.error("DB Fetch Error:", err);
//       return res.status(500).json({ error: "Failed to fetch data" });
//     }

//     // Transforming the rows into the format the frontend expects
//     const responseData = {
//       nextPeriod: 28, // Example, you can calculate this based on your data
//       cycleInsights: {
//         averageLength: 30, // Replace with actual data
//         variation: 2,
//         periodAverageLength: 5,
//         periodVariation: 1,
//       },
//       mostLoggedSymptom: "Bloating", // Example, you can fetch from symptom data
//       history: rows.map((row) => ({
//         date: row.last_period_date,
//         details: row.condition, // You can modify this as per your schema
//       })),
//       symptoms: ["Bloating", "Fatigue"], // Example, use actual symptoms from your data
//     };

//     res.status(200).json(responseData);
//   });
// });
// GET user data
// router.get("/data", (req, res) => {
//   const sql = "SELECT * FROM user_data ORDER BY last_period_date DESC";
//   db.all(sql, [], (err, rows) => {
//     if (err) {
//       console.error("DB Fetch Error:", err);
//       return res.status(500).json({ error: "Failed to fetch data" });
//     }

//     // --- Symptom frequency map ---
//     const symptomMap = {};

//     rows.forEach((row) => {
//       if (row.condition) {
//         const symptoms = row.condition.split(",").map((sym) => sym.trim());
//         symptoms.forEach((symptom) => {
//           symptomMap[symptom] = (symptomMap[symptom] || 0) + 1;
//         });
//       }
//     });

//     const symptoms = Object.keys(symptomMap);
//     const symptomFrequencies = Object.values(symptomMap);

//     const responseData = {
//       nextPeriod: 28,
//       cycleInsights: {
//         averageLength: 30,
//         variation: 2,
//         periodAverageLength: 5,
//         periodVariation: 1,
//       },
//       mostLoggedSymptom:
//         symptoms.length > 0
//           ? symptoms[
//               symptomFrequencies.indexOf(Math.max(...symptomFrequencies))
//             ]
//           : "None",
//       history: rows.map((row) => ({
//         date: row.last_period_date,
//         details: row.condition,
//       })),
//       symptoms,
//       symptomFrequencies, // ← for pie chart
//     };

//     res.status(200).json(responseData);
//   });
// });
router.get("/data", (req, res) => {
  const sql = "SELECT * FROM user_data ORDER BY last_period_date DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    // --- Symptom frequency map ---
    const symptomMap = {};

    rows.forEach((row) => {
      if (row.condition) {
        const symptoms = row.condition.split(",").map((sym) => sym.trim());
        symptoms.forEach((symptom) => {
          symptomMap[symptom] = (symptomMap[symptom] || 0) + 1;
        });
      }
    });

    const symptoms = Object.keys(symptomMap);
    const symptomFrequencies = Object.values(symptomMap);

    // Get the last period's date
    const lastPeriodDate =
      rows.length > 0 ? new Date(rows[0].last_period_date) : null;
    if (!lastPeriodDate) {
      return res.status(400).json({ error: "No period data available." });
    }

    // Get the current date
    const currentDate = new Date();

    // Calculate the number of days between the last period and today
    const diffInTime = currentDate - lastPeriodDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert time difference to days

    // Assume 28 days as the average cycle length (can be dynamically updated if needed)
    const cycleLength = 28;

    // Calculate the next period date by adding the cycle length to the last period's date
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(lastPeriodDate.getDate() + cycleLength);

    // Calculate the estimated date by adjusting based on the difference from the cycle length
    const estimatedDate = new Date(nextPeriodDate);
    estimatedDate.setDate(
      nextPeriodDate.getDate() + (diffInDays - cycleLength)
    );

    // Format the date as YYYY-MM-DD
    const estimatedFormatted = estimatedDate.toISOString().split("T")[0];

    const responseData = {
      nextPeriod: Math.round(diffInDays), // Days from the last period to today
      estimated: estimatedFormatted, // Full estimated next period date
      cycleInsights: {
        averageLength: cycleLength,
        variation: 2,
        periodAverageLength: 5,
        periodVariation: 1,
      },
      mostLoggedSymptom:
        symptoms.length > 0
          ? symptoms[
              symptomFrequencies.indexOf(Math.max(...symptomFrequencies))
            ]
          : "None",
      history: rows.map((row) => ({
        date: row.last_period_date,
        details: row.condition,
      })),
      symptoms,
      symptomFrequencies, // ← for pie chart
    };

    res.status(200).json(responseData);
  });
});

// Express.js example
router.post("/api/user-symptoms", async (req, res) => {
  const { symptom, subSymptom, severity } = req.body;
  try {
    // Save to DB (MongoDB/SQLite/etc.)
    await db.collection("userSymptoms").insertOne({
      symptom,
      subSymptom,
      severity,
      date: new Date(),
    });
    res.status(201).json({ message: "Symptom saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save symptom" });
  }
});

module.exports = router;
