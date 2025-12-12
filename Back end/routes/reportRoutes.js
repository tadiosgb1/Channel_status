// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const auth = require("../middleware/authMiddleware"); // same middleware

// Views
router.get("/report", reportController.renderReport);
router.get("/confirm", auth, reportController.renderConfirm);

// API
router.get("/fetch", auth, reportController.fetchDataAPI);

// Disconnect (optional)
router.get("/disconnect", reportController.disconnect);

module.exports = router;
