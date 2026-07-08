# 🧩 Microservices

This folder is for independent, single-responsibility utility services.
These services can be integrated with any module.

## When should a service be added here?

- If a functionality is used in more than one place
- If any complex processing logic needs to be separated from controllers
- If in the future it needs to be moved to a separate process or service

---

## 📦 Available Microservices

### `imageOptimizer.js`

**Purpose:** Generates 3 optimized versions from an uploaded image.

**Flow:**
```
Input: image buffer + destination folder
         ↓
  ┌──────────────────────────────────┐
  │      imageOptimizer.js           │
  ├──────────────────────────────────┤
  │  Version 1: img-xxx.png          │  ← Original (no changes)
  │  Version 2: img-xxx.webp         │  ← Optimized ≤ 200KB (main display)
  │  Version 3: img-xxx_thum.webp    │  ← Thumbnail < 20KB, blurred (progressive loading)
  └──────────────────────────────────┘
         ↓
Output: { original, webp, thumbnail, baseName }
```

**Progressive Loading Strategy (Frontend):**
```
Page load
  → First, the `thumbnail` (blurred, <20KB) loads instantly
  → Once the `webp` (200KB) is fully loaded
  → Replace the thumbnail with webp
  → Users get a smooth, non-jarring image transition
```

**Usage:**
```js
const { optimizeAndSaveImages } = require('../microservices/imageOptimizer');

const result = await optimizeAndSaveImages(
  file.buffer,          // multer memoryStorage buffer
  file.originalname,    // original file name
  destDir               // e.g. "uploads/properties/my-property"
);

// result:
// {
//   original:  "/uploads/properties/my-property/img-xxx.png",
//   webp:      "/uploads/properties/my-property/img-xxx.webp",
//   thumbnail: "/uploads/properties/my-property/img-xxx_thum.webp",
//   baseName:  "img-xxx"
// }
```

**Dependencies:** `sharp` (already in package.json)

---

## ➕ Future Microservices (Ideas)

| Service | Purpose |
|---|---|
| `pdfOptimizer.js` | Brochure PDF compression & thumbnail generation |
| `videoThumbnail.js` | Extract thumbnail from property video |
| `watermark.js` | Apply brand watermark to images |
| `geoCode.js` | Extract lat/lng coordinates from address |
