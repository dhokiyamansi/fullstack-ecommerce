import mongoose from "mongoose";
import "dotenv/config";

import Product, { type ProductDocument } from "./models/Product.ts";

const products: ProductDocument[] = [
  {
    name: "Classic Leather Sneakers",
    category: "Footwear",
    price: 69.99,
    description: "Comfortable leather sneakers for everyday wear.",
    image: "https://example.com/images/leather-sneakers.jpg",
  },
  {
    name: "Running Sport Trainers",
    category: "Footwear",
    price: 54.99,
    description: "Lightweight running trainers with breathable mesh.",
    image: "https://example.com/images/running-trainers.jpg",
  },
  {
    name: "Casual Slip-On Loafers",
    category: "Footwear",
    price: 45.0,
    description: "Easy slip-on loafers perfect for casual outings.",
    image: "https://example.com/images/slip-on-loafers.jpg",
  },
  {
    name: "Men's Denim Jacket",
    category: "Clothes",
    price: 79.99,
    description: "Classic denim jacket with a relaxed fit.",
    image: "https://example.com/images/denim-jacket.jpg",
  },
  {
    name: "Women's Summer Dress",
    category: "Clothes",
    price: 39.99,
    description: "Lightweight floral summer dress for warm days.",
    image: "https://example.com/images/summer-dress.jpg",
  },
  {
    name: "Unisex Cotton Hoodie",
    category: "Clothes",
    price: 49.99,
    description: "Soft cotton hoodie with a comfortable fit.",
    image: "https://example.com/images/cotton-hoodie.jpg",
  },
  {
    name: "Modern JavaScript Guide",
    category: "Books",
    price: 24.99,
    description: "A practical handbook for modern JavaScript development.",
    image: "https://example.com/images/js-guide.jpg",
  },
  {
    name: "The Art of Minimalism",
    category: "Books",
    price: 18.5,
    description: "A thoughtful book about living with less and finding focus.",
    image: "https://example.com/images/minimalism-book.jpg",
  },
  {
    name: "Startup Growth Playbook",
    category: "Books",
    price: 29.99,
    description: "Strategies and lessons for scaling a startup effectively.",
    image: "https://example.com/images/growth-playbook.jpg",
  },
];

async function seed(): Promise<void> {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding.");

    await Product.deleteMany({});
    console.log("Removed all existing products from the database.");

    await Product.insertMany(products);
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

void seed();
