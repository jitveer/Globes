const Settings = require("./settings.model");
const ApiResponse = require("../../shared/utils/ApiResponse.util");
const asyncHandler = require("../../shared/utils/asyncHandler.util");
const { optimizeAndSaveImages } = require("../../microservices/imageOptimizer");
const path = require("path");

// @desc    Get site settings
// @route   GET /api/v1/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings fetched successfully"));
});

// @desc    Update site settings
// @route   PUT /api/v1/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res) => {
  const { homePageAdVideoUrl, popupAdUrl, removePopupImage } = req.body;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ homePageAdVideoUrl });
  } else {
    if (homePageAdVideoUrl !== undefined) {
      settings.homePageAdVideoUrl = homePageAdVideoUrl;
    }
  }

  if (popupAdUrl !== undefined) {
    settings.popupAdUrl = popupAdUrl;
  }

  const fs = require("fs");
  if (removePopupImage === 'true' && settings.popupAdImage) {
    // Delete files
    const basePath = path.join(__dirname, "../../../");
    try {
      if (settings.popupAdImage.original) fs.unlinkSync(path.join(basePath, settings.popupAdImage.original));
      if (settings.popupAdImage.webp) fs.unlinkSync(path.join(basePath, settings.popupAdImage.webp));
      if (settings.popupAdImage.thumbnail) fs.unlinkSync(path.join(basePath, settings.popupAdImage.thumbnail));
    } catch (err) {
      console.error("Error deleting image files", err);
    }
    settings.popupAdImage = null;
  }

  // Handle Image Upload if present
  if (req.file) {
    const destDir = path.join("uploads", "settings");
    const imagePaths = await optimizeAndSaveImages(
      req.file.buffer,
      req.file.originalname,
      destDir
    );
    settings.popupAdImage = imagePaths;
  }

  await settings.save();

  res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings updated successfully"));
});
