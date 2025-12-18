const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware"); 

router.get("/", auth, userController.getAll);
router.get("/:id", auth, userController.getOne);

router.patch("/:id", auth, userController.update);
router.patch("/:id/deactivate", auth, userController.deactivate);
router.patch("/:id/activate", auth, userController.activate);
router.delete("/:id", auth, userController.delete);

module.exports = router;
