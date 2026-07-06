const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    homePageAdVideoUrl: {
      type: String,
      default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    popupAdImage: {
      type: Object, // To store { original, webp, thumbnail, baseName }
      default: null,
    },
    popupAdUrl: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);