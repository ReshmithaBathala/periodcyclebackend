const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

require("./models/userData");

app.use(cors());
app.use(bodyParser.json());
const symptomsData = [
  {
    name: "Mood",
    subSymptoms: [
      "Mood Swings",
      "Irritability",
      "Anxiety",
      "Sadness",
      "Anger",
      "Emotional Sensitivity",
    ],
  },
  {
    name: "Digestive System",
    subSymptoms: [
      "Bloating",
      "Indigestion",
      "Constipation",
      "Diarrhea",
      "Nausea",
      "Cravings",
      "Loss of Appetite",
    ],
  },
  {
    name: "Breast Tenderness",
    subSymptoms: ["Tenderness", "Pain", "Swelling", "Nipple Sensitivity"],
  },
  {
    name: "Pain",
    subSymptoms: [
      "Cramps",
      "Headache",
      "Lower Back Pain",
      "Joint Pain",
      "Pelvic Pressure",
    ],
  },
  {
    name: "Skin",
    subSymptoms: ["Acne", "Oily Skin", "Dry Skin", "Itchiness"],
  },
  {
    name: "Energy Levels",
    subSymptoms: ["Fatigue", "Lethargy", "Restlessness", "Insomnia"],
  },
  {
    name: "Neurological",
    subSymptoms: [
      "Brain Fog",
      "Dizziness",
      "Light Sensitivity",
      "Sensitivity to Sound",
    ],
  },
  {
    name: "Appetite Changes",
    subSymptoms: [
      "Increased Hunger",
      "Sweet Cravings",
      "Salty Cravings",
      "Food Aversions",
    ],
  },
  {
    name: "Emotional Health",
    subSymptoms: ["Tearfulness", "Low Self-Esteem", "Overthinking", "Panic"],
  },
  {
    name: "Other",
    subSymptoms: ["Breakouts", "Swollen Limbs", "Hot Flashes", "Night Sweats"],
  },
];

// API route to fetch symptoms data
app.get("/api/symptoms", (req, res) => {
  res.json(symptomsData); // Sends the symptom data as JSON
});
const userRoutes = require("./routes/user");
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
