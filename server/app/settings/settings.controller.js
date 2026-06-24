const Settings = require("./settings.model");
const ApiResponse = require("../../shared/utils/ApiResponse.util");
const asyncHandler = require("../../shared/utils/asyncHandler.util");

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
  const { homePageAdVideoUrl } = req.body;
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ homePageAdVideoUrl });
  } else {
    settings.homePageAdVideoUrl = homePageAdVideoUrl;
    await settings.save();
  }
  res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings updated successfully"));
});
