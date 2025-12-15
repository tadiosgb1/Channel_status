const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // ======================
  // REGISTER
  // ======================
  register: async (req, res) => {
    try {
      const { first_name, last_name, username, email, password, role } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        first_name,
        last_name,
        username,
        email,
        password: hashed,
        role
      });

      // Remove password before sending response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({ message: "Registered", user: userResponse });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ======================
  // LOGIN (email OR username)
  // ======================
  login: async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Optional but recommended: block inactive users
    if (user.status && user.status !== "Active") {
      return res.status(403).json({ error: "Account is inactive" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    req.session.userId = user.id;

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: "Logged in", user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},


  // ======================
  // LOGOUT
  // ======================
  logout: (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("sid");
      res.json({ message: "Logged out" });
    });
  }
};
