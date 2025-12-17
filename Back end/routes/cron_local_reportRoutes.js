const express = require("express");
const router = express.Router();
const controller = require("../controllers/Cron_local_reportController");
const auth = require("../middleware/authMiddleware");

// ---------- Chart report routes (specific) ----------
router.get("/chart/report", auth, controller.getChartReport);
router.get("/ussd/report", auth, controller.getUssdChartReport);
router.get("/app/report", auth, controller.getMobileChartReport);

// ---------- CRUD routes ----------
router.get("/", auth, controller.getAll);
// router.post("/", auth, controller.create);



module.exports = router;
