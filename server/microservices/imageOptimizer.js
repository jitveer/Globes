/**
 * ============================================================
 *  IMAGE OPTIMIZER MICROSERVICE
 * ============================================================
 *  This microservice takes an uploaded image buffer and
 *  generates 3 versions of it:
 *
 *  1. myimage.png        → Original image (without changes)
 *  2. myimage.webp       → Optimized WebP (100-200 KB, for main display)
 *  3. myimage_thum.webp  → Thumbnail WebP (< 20 KB, blurred, for fast loading)
 *
 *  Progressive Loading Strategy:
 *  - First, the blurry thumbnail loads instantly
 *  - Once the full webp is loaded, the thumbnail is replaced
 *
 *  Usage:
 *    const { optimizeAndSaveImages } = require('../../microservices/imageOptimizer');
 *    const result = await optimizeAndSaveImages(file.buffer, file.originalname, destDir);
 *    // result = { original, webp, thumbnail, baseName }
 * ============================================================
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/**
 * Generates and saves 3 versions of an image.
 *
 * @param {Buffer} imageBuffer    - Image buffer received from Multer
 * @param {string} originalName   - Original filename (e.g. "house.jpg")
 * @param {string} destDir        - Folder where images should be saved (e.g. "uploads/properties/my-property")
 *
 * @returns {Promise<{
 *   original: string,    - Relative path of saved original PNG
 *   webp: string,        - Relative path of saved optimized WebP
 *   thumbnail: string,   - Relative path of saved thumbnail WebP
 *   baseName: string     - Base name used (without extension)
 * }>}
 */
async function optimizeAndSaveImages(imageBuffer, originalName, destDir) {
  // 1. Ensure destination folder exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 2. Generate unique base name (timestamp + random)
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const baseName = `img-${uniqueSuffix}`;

  // Define file paths
  const originalPath = path.join(destDir, `${baseName}.png`);
  const webpPath = path.join(destDir, `${baseName}.webp`);
  const thumbPath = path.join(destDir, `${baseName}_thum.webp`);

  // ─────────────────────────────────────────────
  // VERSION 1: Original PNG (no changes)
  // ─────────────────────────────────────────────
  await sharp(imageBuffer).png({ compressionLevel: 6 }).toFile(originalPath);

  // ─────────────────────────────────────────────
  // VERSION 2: Optimized WebP (100-200 KB)
  // Target size: <= 200KB
  // Strategy: adjust quality according to size
  // ─────────────────────────────────────────────
  const webpBuffer = await _createOptimizedWebP(imageBuffer, 200);
  fs.writeFileSync(webpPath, webpBuffer);

  // ─────────────────────────────────────────────
  // VERSION 3: Thumbnail WebP (< 20KB, blurred)
  // This is used for progressive loading
  // ─────────────────────────────────────────────
  const thumbBuffer = await _createThumbnailWebP(imageBuffer, 20);
  fs.writeFileSync(thumbPath, thumbBuffer);

  // Return relative paths (forward slashes for URLs)
  const toUrlPath = (p) => "/" + p.replace(/\\/g, "/");

  return {
    original: toUrlPath(originalPath),
    webp: toUrlPath(webpPath),
    thumbnail: toUrlPath(thumbPath),
    baseName,
  };
}

/**
 * Creates an optimized WebP image that is within targetSizeKB.
 * Adjusts quality using binary search.
 *
 * @param {Buffer} inputBuffer
 * @param {number} targetSizeKB  - Maximum allowed size in KB (default 200)
 * @returns {Promise<Buffer>}
 */
async function _createOptimizedWebP(inputBuffer, targetSizeKB = 200) {
  const targetBytes = targetSizeKB * 1024;

  // Get image metadata (width, height)
  const meta = await sharp(inputBuffer).metadata();
  const originalWidth = meta.width || 1920;

  // Cap max width (resize if the image is extremely large)
  const maxWidth = Math.min(originalWidth, 1920);

  let quality = 82; // Starting quality
  let minQ = 30;
  let maxQ = 90;
  let bestBuffer = null;

  // Binary search: adjust quality so that size is within target
  for (let attempt = 0; attempt < 8; attempt++) {
    const buf = await sharp(inputBuffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    if (buf.length <= targetBytes) {
      bestBuffer = buf;
      minQ = quality + 1; // Try higher quality
    } else {
      maxQ = quality - 1; // Needs lower quality
    }

    quality = Math.round((minQ + maxQ) / 2);

    if (minQ > maxQ) break;
  }

  // Fallback to lower quality if no acceptable buffer was found
  if (!bestBuffer) {
    bestBuffer = await sharp(inputBuffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: minQ > 30 ? minQ : 30 })
      .toBuffer();
  }

  return bestBuffer;
}

/**
 * Creates a Thumbnail WebP image:
 * - Size under 20KB
 * - Slightly blurred (for placeholder effect)
 * - Small dimensions
 *
 * @param {Buffer} inputBuffer
 * @param {number} targetSizeKB  - Maximum allowed size in KB (default 20)
 * @returns {Promise<Buffer>}
 */
async function _createThumbnailWebP(inputBuffer, targetSizeKB = 20) {
  const targetBytes = targetSizeKB * 1024;

  // Thumbnail dimensions: max 400px wide (sufficient for placeholders)
  const THUMB_WIDTH = 400;
  // Blur sigma: 2-3 looks good (too much blur = ugly)
  const BLUR_SIGMA = 2.5;

  let quality = 40;
  let minQ = 10;
  let maxQ = 65;
  let bestBuffer = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const buf = await sharp(inputBuffer)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .blur(BLUR_SIGMA)
      .webp({ quality })
      .toBuffer();

    if (buf.length <= targetBytes) {
      bestBuffer = buf;
      minQ = quality + 1;
    } else {
      maxQ = quality - 1;
    }

    quality = Math.round((minQ + maxQ) / 2);

    if (minQ > maxQ) break;
  }

  // Try even smaller size if target size was not met
  if (!bestBuffer) {
    bestBuffer = await sharp(inputBuffer)
      .resize({ width: 200, withoutEnlargement: true })
      .blur(BLUR_SIGMA)
      .webp({ quality: 20 })
      .toBuffer();
  }

  return bestBuffer;
}

module.exports = { optimizeAndSaveImages };
