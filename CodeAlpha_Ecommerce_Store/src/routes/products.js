const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ products });
  } catch (err) { next(err); }
});
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ product });
  } catch (err) { next(err); }
});
module.exports = router;
