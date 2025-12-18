const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware"); 
router.post("/register", auth,authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/change-password", auth, authController.changePassword);
module.exports = router; // ✅ must export the router
