import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const products = [
  { name: "Everyday Sneakers", description: "Comfortable low-top sneakers for daily wear.", price: 79.99, category: "Footwear", stock: 25, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900" },
  { name: "Minimal Backpack", description: "Water-resistant backpack with a clean everyday design.", price: 64.99, category: "Bags", stock: 18, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900" },
  { name: "Classic Watch", description: "Minimal stainless-steel watch with a timeless dial.", price: 129.99, category: "Accessories", stock: 12, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900" },
  { name: "Ceramic Mug", description: "Hand-finished ceramic mug for coffee and tea.", price: 18.5, category: "Home", stock: 40, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900" },
  { name: "Cotton Hoodie", description: "Soft heavyweight cotton hoodie with a relaxed fit.", price: 54.99, category: "Apparel", stock: 30, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900" },
  { name: "Wireless Headphones", description: "Over-ear headphones with rich sound and long battery life.", price: 149.99, category: "Electronics", stock: 15, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900" }
];

await connectDB();
await Product.deleteMany({});
await Product.insertMany(products);

const email = "admin@example.com";
const existing = await User.findOne({ email });
if (!existing) {
  await User.create({
    name: "Store Admin",
    email,
    password: await bcrypt.hash("Admin123!", 12),
    role: "admin"
  });
}
console.log("Seed complete");
process.exit(0);
