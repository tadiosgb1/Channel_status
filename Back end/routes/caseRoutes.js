const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, caseController.getAll);
router.get("/:id", auth, caseController.getOne);
router.post("/", auth, caseController.create);
router.patch("/:id", auth, caseController.update);           // partial update
router.patch("/:id/resolve", auth, caseController.resolve); // mark resolved
router.delete("/:id", auth, caseController.delete);

module.exports = router;
