import { CartItem } from "@/types/cart.types";

const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `${token ?? ""}`,
    "Content-Type": "application/json",
  };
};

export const fetchCartItems = async (): Promise<CartItem[]> => {
  const response = await fetch(`${API_BASE_URL}/cart/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart data");
  }

  const data = await response.json();
  return Array.isArray(data?.items) ? data.items : [];
};

export const increaseCartItemQuantity = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cart/increase/${id}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to increase quantity");
  }
};

export const decreaseCartItemQuantity = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cart/decrease/${id}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to decrease quantity");
  }
};

export const removeCartItem = async (id: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/cart/remove/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const persistCheckoutItems = async (items: CartItem[]): Promise<void> => {
  await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });
};
