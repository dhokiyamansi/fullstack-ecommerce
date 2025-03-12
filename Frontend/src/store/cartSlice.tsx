import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  cartCount: number;
}

const initialState: CartState = {
  items: [],
  cartCount: 0, // ✅ This will store the total number of cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setReduxCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.cartCount = action.payload.reduce((total, item) => total + 1, 0);
      
    },
  },
});

export const { setReduxCartItems } = cartSlice.actions;
export default cartSlice.reducer;
