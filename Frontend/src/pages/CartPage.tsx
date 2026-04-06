"use client";

import { setReduxCartItems } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  decreaseCartItemQuantity,
  fetchCartItems,
  increaseCartItemQuantity,
  persistCheckoutItems,
  removeCartItem,
} from "@/services/cart.service";
import { CartItem } from "@/types/cart.types";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const loadCart = useCallback(async () => {
    try {
      const items = await fetchCartItems();
      setCartItems(items);
      dispatch(setReduxCartItems(items));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const increaseQuantity = async (id: string) => {
    try {
      await increaseCartItemQuantity(id);
      await loadCart();
    } catch (error) {
      console.error("Error increasing quantity:", error);
      alert("Could not update quantity. Please try again.");
    }
  };

  const decreaseQuantity = async (id: string) => {
    try {
      await decreaseCartItemQuantity(id);
      await loadCart();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      alert("Could not update quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(id);
    await loadCart();
  };

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + (item?.price ?? 0) * (item?.quantity ?? 1), 0),
    [cartItems],
  );

  const onCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before proceeding.");
      return;
    }
    await persistCheckoutItems(cartItems);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-24 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Shopping Cart</h2>
      <div className="w-4/5 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="w-full space-y-4 h-[300px]">
          <h3 className="text-xl font-semibold">Your Items</h3>
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-lg font-medium">{item.name}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => decreaseQuantity(item._id)} className="px-2 py-1 bg-gray-300 rounded-md">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)} className="px-2 py-1 bg-gray-300 rounded-md">
                    +
                  </button>
                </div>
                <span className="font-medium">₹{item.price * item.quantity}</span>
                <button onClick={() => handleRemoveItem(item._id)} className="px-3 py-1 bg-red-500 text-white rounded-md">
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <div className="w-full space-y-4 mt-8">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="flex justify-between p-3 border rounded-md">
            <span>Total Price</span>
            <span className="font-semibold text-lg">₹{totalPrice}</span>
          </div>
          <button
            onClick={onCheckout}
            className="mt-4 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-800 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
