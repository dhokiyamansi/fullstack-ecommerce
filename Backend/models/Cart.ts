import { Schema, Types, model } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface CartDocument {
  userId: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
}

const cartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false },
);

const cartSchema = new Schema<CartDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const Cart = model<CartDocument>("Cart", cartSchema);

export default Cart;
