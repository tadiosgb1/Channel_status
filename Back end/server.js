require("dotenv").config();
const express = require("express");
const caseRoutes = require('./routes/caseRoutes.js');
const session = require("express-session");
const cors = require("cors");
const db = require("./models");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "strict"
    }
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes); // mount the routes

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.use("/api/case", caseRoutes);
app.listen(PORT, () => console.log("Server running on port " + PORT));
});
