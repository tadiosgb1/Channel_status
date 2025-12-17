const express = require("express");
const router = express.Router();
const controller = require("../controllers/Cron_local_reportController");
const auth = require("../middleware/authMiddleware"); // same middleware
router.get("/", auth,controller.getAll);
router.get("/:id",  auth,controller.getOne);
router.post("/",  auth, controller.create);
router.put("/:id",   auth,controller.update);
router.delete("/:id",  auth,controller.delete);
router.get("/chart/report", auth,controller.getChartReport)
module.exports = router;
