const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: "General" },
  image: { type: String, default: "https://placehold.co/600x400?text=Product" },
  stock: { type: Number, default: 20, min: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model("Product", productSchema);
