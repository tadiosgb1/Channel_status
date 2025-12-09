// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware"); // import as function

// Protected routes
router.get("/", auth, userController.getAll);
router.get("/:id", auth, userController.getOne);

module.exports = router;
