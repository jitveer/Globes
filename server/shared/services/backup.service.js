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
 * Generates a ZIP backup containing all Mongoose collections exported as formatted JSON
 * 
 * @param {Object} res - Express response object to stream the ZIP
 */
const generateDatabaseBackupStream = async (res) => {
  const { ZipArchive } = await import("archiver");
  const archive = new ZipArchive({
    zlib: { level: 1 }, // Fastest compression to prevent timeouts
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(res);

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

  await archive.finalize();
};

/**
 * Generates a ZIP backup containing files in the uploads folder
 * 
 * @param {Object} res - Express response object to stream the ZIP
 */
const generateMediaBackupStream = async (res) => {
  const { ZipArchive } = await import("archiver");
  const archive = new ZipArchive({
    zlib: { level: 1 }, // Fastest compression to prevent timeouts
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(res);

  const uploadsPath = path.join(__dirname, "../../uploads");
  if (fs.existsSync(uploadsPath)) {
    archive.directory(uploadsPath, "uploads");
  } else {
    console.warn("Uploads directory not found at:", uploadsPath);
  }

  await archive.finalize();
};

module.exports = {
  generateDatabaseBackupStream,
  generateMediaBackupStream,
};
