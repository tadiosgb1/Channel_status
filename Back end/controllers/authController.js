const bcrypt = require("bcrypt");
const { User } = require("../models");
const { Op } = require("sequelize");
const { sendRegistrationEmail } = require("../utils/email"); // create this helper
module.exports = {
  // ======================
  // REGISTER
  // ======================
 register: async (req, res) => {
  try {
    // 1. Get userId from session
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 2. Fetch user from database
    const sessionUser = await User.findByPk(userId);
    if (!sessionUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3. Only allow Admin role
    if (sessionUser.role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can register new users" });
    }

    const { first_name, last_name, username, email, password, role } = req.body;

    // 4. Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 5. Create new user
    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashed,
      role
    });

     // Send email with username and password
      if (email) {
        await sendRegistrationEmail(email, username, password);
      }

    // 7. Remove password before sending response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: "Registered successfully, email sent", user: userResponse });

  } catch (err) {
    console.error("Registration error:", err);
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


changePassword: async (req, res) => {
  console.log("passs",req.body)
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new passwords are required" });
    }

    // Fetch user from DB
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Change password error:", err);
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
