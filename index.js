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
    subSymptoms: ["Mood Swings", "Irritability", "Anxiety", "Sadness"],
  },
  {
    name: "Digestive System",
    subSymptoms: ["Bloating", "Indigestion", "Constipation"],
  },
  {
    name: "Breast Tenderness",
    subSymptoms: ["Tenderness", "Pain"],
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
