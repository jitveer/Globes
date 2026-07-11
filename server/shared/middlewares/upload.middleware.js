/**
 * Upload Middleware (Multer - Memory Storage)
 *
 * NOTE: We are now using memoryStorage instead of diskStorage.
 * Files will not go directly to disk — the buffer will be received by the controller.
 * The controller will then call the imageOptimizer.js microservice, which
 * will generate 3 versions (original PNG, optimized WebP, thumbnail WebP)
 * and save them to the correct folder.
 *
 * Benefits of this approach:
 *  - Buffer is required for Sharp processing
 *  - Full control over file saving is with the controller
 *  - Clean microservices pattern
 *
 * Allowed file types:
 *  - Images: JPEG, JPG, PNG, GIF, WEBP
 *  - Documents: PDF
 */

const multer = require("multer");

// Memory storage: files will be stored in memory (buffer), not on disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|pdf)$/i;
  const allowedMimetypes =
    /^(image\/(jpeg|jpg|png|gif|webp|x-png|pjpeg)|application\/pdf)$/i;

  const hasAllowedExtension = allowedExtensions.test(
    file.originalname.toLowerCase(),
  );
  const hasAllowedMimetype = allowedMimetypes.test(file.mimetype);

  if (hasAllowedExtension && hasAllowedMimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File upload failed. Invalid file type: ${file.originalname} (${file.mimetype}). Only images (JPEG, JPG, PNG, GIF, WEBP) and PDF documents are allowed.`,
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // default 50MB (PDFs can be larger)
  },
});

module.exports = upload;
