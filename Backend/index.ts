import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import usersRoute from "./routes/auth.ts";
import cartRoute from "./routes/cart.ts";
import orderRoute from "./routes/order.ts";
import productRoute from "./routes/product.ts";
import productRoutes from "./routes/productlist.ts";

const app = express();
const PORT = process.env.PORT ?? 5500;
const mongoUri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in .env");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((error: unknown) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

app.use("/auth/", usersRoute);
app.use("/productlist/", productRoutes);
app.use("/product/", productRoute);
app.use("/cart/", cartRoute);
app.use("/order/", orderRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
