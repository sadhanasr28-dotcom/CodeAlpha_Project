const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    quantity: { type: Number, min: 1 }
  }],
  total: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  status: { type: String, enum: ["Placed", "Processing", "Shipped", "Delivered"], default: "Placed" }
}, { timestamps: true });
module.exports = mongoose.model("Order", orderSchema);
