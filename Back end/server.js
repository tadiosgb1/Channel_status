require("dotenv").config();
const express = require("express");
const cron_local_reportRoutes = require('./routes/cron_local_reportRoutes.js');
const session = require("express-session");
const cors = require("cors");
const db = require("./models");
const axios = require("axios");
const cron = require("node-cron");
const {sendEmails} = require("./utils.js")
const Cron_local_report = db.Cron_local_report;
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
db.sequelize.sync().then(() => {
  console.log("Database synced");
  app.use("/api/cron_local_report", cron_local_reportRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});



cron.schedule("*/2 * * * *", async () => {
  try {
    console.log("Cron job triggering /api/reports/report");

    // Fetch the report from your API
    // const response = await axios.get(`${process.env.APP_URL}/api/reports/report`, {
    //   headers: { "x-system-key": process.env.SYSTEM_KEY } // if system auth
    // });

      const response = await axios.get(`${process.env.APP_URL}/api/reports/report`);
      const reportData = response.data; // the full API response
    // Check if record already exists
      const existing = await Cron_local_report.findOne();

    if (existing) {
      // Update existing record
      await existing.update({ data: reportData });
      console.log("Report updated successfully at", new Date());
    } else {
      // Create new record
      await Cron_local_report.create({ data: reportData });
      console.log("Report created successfully at", new Date());
    }

  } catch (err) {
    console.error("Cron job failed:", err.message);
  }
}, {
  timezone: "Africa/Addis_Ababa"
});



// Cron job: call /api/email/send every day at 2:00 AM ET
// cron.schedule("*/2 * * * *", async () => {
//   try {
//     console.log("Cron job: Sending login links to users...");

//     const response = await axios.post(
//       `${process.env.APP_URL}/api/email/send`
//     );

//     console.log("Cron result:", response.data);

//   } catch (err) {
//     console.error("Cron error:", err.message);
//   }
// }, {
//   timezone: "Africa/Addis_Ababa"
// });

//Monday–Thursday:02:00, 04:00, 06:00, 08:00, 10:00
cron.schedule("0 2,4,6,8,10 * * 1-4", sendEmails, {
  timezone: "Africa/Addis_Ababa"
});

// Friday: 02:00, 04:00, 08:00, 10:00
cron.schedule("0 2,4,8,10 * * 5", sendEmails, {
  timezone: "Africa/Addis_Ababa"
});

// Friday: 05:30
cron.schedule("30 5 * * 5", sendEmails, {
  timezone: "Africa/Addis_Ababa"
});

cron.schedule("0 2,4,6 * * 6", sendEmails, {
  timezone: "Africa/Addis_Ababa"
});