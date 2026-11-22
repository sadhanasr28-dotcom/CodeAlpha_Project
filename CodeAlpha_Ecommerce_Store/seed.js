require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

const products = [
  { name: "Wireless Headphones", description: "Comfortable over-ear headphones with clear sound and long battery life.", price: 1499, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", stock: 25, featured: true },
  { name: "Smart Watch", description: "A stylish everyday smartwatch for activity tracking and notifications.", price: 2299, category: "Electronics", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", stock: 18, featured: true },
  { name: "Casual Backpack", description: "A lightweight backpack with useful compartments for daily use.", price: 999, category: "Fashion", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", stock: 30 },
  { name: "Running Shoes", description: "Lightweight shoes designed for comfortable everyday movement.", price: 1899, category: "Fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", stock: 15 },
  { name: "Desk Lamp", description: "A clean, modern desk lamp for your study or workspace.", price: 799, category: "Home", image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80", stock: 22 },
  { name: "Ceramic Coffee Mug", description: "A simple ceramic mug for coffee, tea and everyday use.", price: 299, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80", stock: 40 }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products.map(p => ({ ...p, image: p.image.replace(" 三", "").replace("ㅋㅋ", "") })));
    console.log("Sample products inserted.");
    await mongoose.disconnect();
  })
  .catch(err => { console.error(err); process.exit(1); });
