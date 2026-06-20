const mongoose = require("mongoose");
require("dotenv").config();
const Property = require("./app/properties/properties.model");

const checkProperty = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    const property = await Property.findOne({ title: /Golden Towers/i });
    if (!property) {
      console.log("Property 'Golden Towers' not found in database!");
    } else {
      console.log("Property ID:", property._id);
      console.log("Property Title:", property.title);
      console.log("Property priceRange:", property.priceRange);
      console.log("Property plans:", JSON.stringify(property.plans, null, 2));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
};

checkProperty();
