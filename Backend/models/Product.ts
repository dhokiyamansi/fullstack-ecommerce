import { Schema, model } from "mongoose";

export interface ProductDocument {
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

const productSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

const Product = model<ProductDocument>("Product", productSchema);

export default Product;
