const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Explicitly require all models to ensure they are registered with Mongoose
require("../../app/users/user.model");
require("../../app/properties/properties.model");
require("../../app/blogs/blog.model");
require("../../app/properties_inquiries/inquiry.model");
require("../../app/notifications/admin_notification.model");
require("../../app/user_notifications/user_notification.model");
require("../../app/settings/settings.model");
require("../../app/schedule_visit/scheduleVisit.model");
require("../../app/wishlist/wishlist.model");
require("../../app/otp/otp.model");

/**
 * Generates a ZIP backup containing:
 * - All Mongoose collections exported as formatted JSON
 * - All files in the uploads folder
 * 
 * @param {Object} res - Express response object to stream the ZIP
 */
const generateBackupStream = async (res) => {
  const { ZipArchive } = await import("archiver");
  const archive = new ZipArchive({
    zlib: { level: 9 }, // Maximum compression level
  });

  // Handle archive errors
  archive.on("error", (err) => {
    throw err;
  });

  // Pipe archive data directly to the Express response
  archive.pipe(res);

  // 1. Export Database Collections
  const modelNames = mongoose.modelNames();
  for (const modelName of modelNames) {
    try {
      const Model = mongoose.model(modelName);
      const documents = await Model.find({}).lean();
      const jsonContent = JSON.stringify(documents, null, 2);
      archive.append(jsonContent, { name: `database/${modelName}.json` });
    } catch (err) {
      console.error(`Error backing up model ${modelName}:`, err);
    }
  }

  // 2. Export local uploads folder
  const uploadsPath = path.join(__dirname, "../../uploads");
  if (fs.existsSync(uploadsPath)) {
    archive.directory(uploadsPath, "uploads");
  } else {
    console.warn("Uploads directory not found at:", uploadsPath);
  }

  // Finalize the archive (this completes the ZIP stream)
  await archive.finalize();
};

module.exports = {
  generateBackupStream,
};
