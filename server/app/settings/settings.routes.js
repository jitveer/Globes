const express = require("express");
const router = express.Router();
const settingsController = require("./settings.controller");
const { protect } = require("../../shared/middlewares/auth.middleware");
const upload = require("../../shared/middlewares/upload.middleware");

router.get("/", settingsController.getSettings);
router.put("/", protect, upload.single("popupAdImage"), settingsController.updateSettings);

module.exports = router;
