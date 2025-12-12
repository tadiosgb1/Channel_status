const bcrypt = require("bcrypt");
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
     console.log("user",user)
      res.json({ message: "Registered", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
           console.log(user);
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
};
