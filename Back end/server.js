require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./models");
const axios = require("axios");
const cron = require("node-cron");

// Routes
const caseRoutes = require('./routes/caseRoutes.js');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    secure: false,
    sameSite: "strict" }
}));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/case", caseRoutes);
app.use("/api/email", emailRoutes);

const PORT = process.env.PORT || 5000;

// Sync DB and start server
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Cron job: call /api/email/send every day at 2:00 AM ET
cron.schedule("0 2 * * *", async () => {
  try {
    console.log("Cron job triggering /api/email/send at 2:00 AM ET");

    const response = await axios.post(`${process.env.APP_URL}/api/email/send`, {});

    console.log("Cron response:", response.data);
  } catch (err) {
    console.error("Cron job failed:", err.message);
  }
}, {
  timezone: "Africa/Addis_Ababa"
});
