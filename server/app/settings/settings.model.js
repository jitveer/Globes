const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    homePageAdVideoUrl: {
      type: String,
      default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
