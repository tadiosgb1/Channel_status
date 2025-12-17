#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const baseDir = process.cwd();
const folders = ["controllers", "models", "routes", "middleware", "config"];

// Create folders
folders.forEach(folder => {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// ===================
// .env
// ===================
fs.writeFileSync(path.join(baseDir, ".env"), `PORT=5000
SESSION_SECRET=your_session_secret
`);

// ===================
// config/config.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "config", "config.js"),
  `module.exports = {
  development: {
    username: "root",
    password: "",
    database: "web_db",
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false
  }
};`
);

// ===================
// models/index.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "models", "index.js"),
  `const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

fs.readdirSync(__dirname)
  .filter(f => f !== "index.js" && f.endsWith(".js"))
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file));
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;`
);

// ===================
// models/User.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "models", "User.js"),
  `module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User"
    }
  });

  return User;
};`
);

// ===================
// middleware/authMiddleware.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "middleware", "authMiddleware.js"),
  `module.exports = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
  next();
};`
);

// ===================
// controllers/authController.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "controllers", "authController.js"),
  `const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = {
  register: async (req, res) => {
    try {
      const { first_name, last_name, email, password, role } = req.body;
      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashed,
        role
      });

      res.json({ message: "Registered", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ error: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: "Invalid password" });

      req.session.userId = user.id;

      res.json({ message: "Logged in", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("sid");
      res.json({ message: "Logged out" });
    });
  }
};`
);

// ===================
// controllers/userController.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "controllers", "userController.js"),
  `const { User } = require("../models");

module.exports = {
  getAll: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};`
);

// ===================
// routes/authRoutes.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "routes", "authRoutes.js"),
  `const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;`
);

// ===================
// routes/userRoutes.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "routes", "userRoutes.js"),
  `const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, userController.getAll);
router.get("/:id", auth, userController.getOne);

module.exports = router;`
);

// ===================
// server.js
// ===================
fs.writeFileSync(
  path.join(baseDir, "server.js"),
  `require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./models");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

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

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log("Server running on port " + PORT));
});
`
);

console.log("HTTP-only cookie authentication scaffold created successfully!");
