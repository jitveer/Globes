const express = require("express");
const router = express.Router();
const settingsController = require("./settings.controller");
const { protect } = require("../../shared/middlewares/auth.middleware");

router.get("/", settingsController.getSettings);
router.put("/", protect, settingsController.updateSettings);

module.exports = router;
