const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");

router.post("/", auth, async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "Your cart is empty." });
    if (!shippingAddress || String(shippingAddress).trim().length < 8) return res.status(400).json({ message: "Please enter a complete shipping address." });

    const orderItems = [];
    let total = 0;
    for (const item of items) {
      if (!mongoose.isValidObjectId(item.productId)) return res.status(400).json({ message: "Invalid product in cart." });
      const quantity = Math.floor(Number(item.quantity));
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return res.status(400).json({ message: "Invalid item quantity." });
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "A product in your cart no longer exists." });
      if (product.stock < quantity) return res.status(400).json({ message: `Only ${product.stock} item(s) of ${product.name} are available.` });
      orderItems.push({ product: product._id, name: product.name, price: product.price, quantity });
      total += product.price * quantity;
    }
    for (const item of orderItems) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({
      user: req.user.id, items: orderItems, total,
      shippingAddress: String(shippingAddress).trim()
    });
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) { next(err); }
});

router.get("/my-orders", auth, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) { next(err); }
});
module.exports = router;
