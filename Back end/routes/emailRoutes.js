const express = require("express");
const router = express.Router();
const controller = require("../controllers/emailController");
const auth = require("../middleware/authMiddleware");
// Single endpoint to send emails
router.post("/send", auth, controller.sendEmails);
module.exports = router;
