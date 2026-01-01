require("dotenv").config();
const express = require("express");
const cron_local_reportRoutes = require('./routes/cron_local_reportRoutes.js');
const { Op } = require("sequelize");
const session = require("express-session");
const cors = require("cors");
const db = require("./models");
const axios = require("axios");
const cron = require("node-cron");
const {sendEmails} = require("./utils.js")
const Cron_local_report = db.Cron_local_report;
const Daily_cron_local_report = db.Daily_cron_local_report;
const  {DateTime}= require ("luxon");
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
  app.use("/api/cron_local_report", cron_local_reportRoutes);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});



// cron.schedule("*/2 * * * *", async () => {
//   try {
//     console.log("Cron job triggering /api/reports/report");

//     // Fetch the report from your API
//     const response = await axios.get(`${process.env.APP_URL}/api/reports/report`);
//     const reportData = response.data; // the full API response

//     // Always create a new record
//     await Cron_local_report.create({ data: reportData });
//     console.log("Report created successfully at", new Date());

//   } catch (err) {
//     console.error("Cron job failed:", err.message);
//   }
// }, {
//   timezone: "Africa/Addis_Ababa"
// });



 const startOfToday = new Date();
 console.log("startToday",startOfToday);
 
// let isCronRunning = false;

// cron.schedule("*/2 * * * *", async () => {
//   if (isCronRunning) {
//     console.log("Previous cron still running, skipping this run");
//     return;
//   }

//   isCronRunning = true;

//   try {
//     console.log("Cron job triggering /api/reports/report");

//     const response = await axios.get(`${process.env.APP_URL}/api/reports/report`);
//     const reportData = response.data; // ✅ DO NOT stringify

//     // 1️⃣ Always create in Daily
//     await Daily_cron_local_report.create({ data: reportData });

//     // 2️⃣ Daily cleanup (unchanged)
//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);

//     const lastPastDaily = await Daily_cron_local_report.findOne({
//       where: {
//         createdAt: { [Op.lt]: startOfToday }
//       },
//       order: [["createdAt", "DESC"]],
//     });

//     if (lastPastDaily) {
//       const pastDateStart = new Date(lastPastDaily.createdAt);
//       pastDateStart.setHours(0, 0, 0, 0);

//       const pastDateEnd = new Date(pastDateStart);
//       pastDateEnd.setHours(23, 59, 59, 999);

//       // 🔥 DELETE ALL records from that past date
//       await Daily_cron_local_report.destroy({
//         where: {
//           createdAt: {
//             [Op.between]: [pastDateStart, pastDateEnd],
//           },
//         },
//       });

//       console.log(
//         `Daily cleanup: deleted ALL records for ${pastDateStart.toDateString()}`
//       );
//     }




//     // 3️⃣ Cron table create/update today
//     const endOfToday = new Date(startOfToday);
//     endOfToday.setHours(23, 59, 59, 999);

//     const todayReport = await Cron_local_report.findOne({
//       where: {
//         createdAt: { [Op.between]: [startOfToday, endOfToday] },
//       },
//     });

//     if (todayReport) {
//       await todayReport.update({ data: reportData });
//     } else {
//       await Cron_local_report.create({ data: reportData });
//     }

//   } catch (err) {
//     console.error("Cron job failed:", err.message);
//   } finally {
//     isCronRunning = false;
//   }
// }, {
//   timezone: "Africa/Addis_Ababa",
// });


let isCronRunning = false;

cron.schedule(
  "*/2 * * * *", // every 2 minutes
  async () => {
    if (isCronRunning) {
      console.log("Previous cron still running, skipping this run");
      return;
    }

    isCronRunning = true;

    try {
      console.log("Cron job triggering /api/reports/report");

      // Fetch report
      const response = await axios.get(`${process.env.APP_URL}/api/reports/report`);
      const reportData = response.data; // DO NOT stringify

      // -----------------------------
      // 1️⃣ Manually add 3 hours for UTC+3
      // -----------------------------
      const nowUTC = new Date();
      const nowUTCPlus3 = new Date(nowUTC.getTime() + 3 * 60 * 60 * 1000);

      // -----------------------------
      // 1️⃣ Always create in Daily with manual UTC+3
      // -----------------------------
      await Daily_cron_local_report.create({
        data: reportData,
        createdAt: nowUTCPlus3,
        updatedAt: nowUTCPlus3,
      });

      // -----------------------------
      // 2️⃣ Daily cleanup using UTC+3
      // -----------------------------
      const startOfToday = new Date(nowUTCPlus3);
      startOfToday.setHours(0, 0, 0, 0);

      const lastPastDaily = await Daily_cron_local_report.findOne({
        where: {
          createdAt: { [Op.lt]: startOfToday },
        },
        order: [["createdAt", "DESC"]],
      });

      if (lastPastDaily) {
        const pastDateStart = new Date(lastPastDaily.createdAt);
        pastDateStart.setHours(0, 0, 0, 0);

        const pastDateEnd = new Date(lastPastDaily.createdAt);
        pastDateEnd.setHours(23, 59, 59, 999);

        await Daily_cron_local_report.destroy({
          where: {
            createdAt: { [Op.between]: [pastDateStart, pastDateEnd] },
          },
        });

        console.log(`Daily cleanup: deleted ALL records for ${pastDateStart.toDateString()}`);
      }

      // -----------------------------
      // 3️⃣ Cron table create/update today with UTC+3
      // -----------------------------
      const endOfToday = new Date(startOfToday);
      endOfToday.setHours(23, 59, 59, 999);

      const todayReport = await Cron_local_report.findOne({
        where: {
          createdAt: { [Op.between]: [startOfToday, endOfToday] },
        },
      });

      if (todayReport) {
        await todayReport.update({
          data: reportData,
          updatedAt: nowUTCPlus3,
        });
      } else {
        await Cron_local_report.create({
          data: reportData,
          createdAt: nowUTCPlus3,
          updatedAt: nowUTCPlus3,
        });
      }

      console.log("Cron job completed successfully.");

    } catch (err) {
      console.error("Cron job failed:", err.message);
    } finally {
      isCronRunning = false;
    }
  },
  {
    timezone: "Africa/Addis_Ababa",
  }
);









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

  //saturday
cron.schedule("0 2,4,6 * * 6", sendEmails, {
  timezone: "Africa/Addis_Ababa"
});