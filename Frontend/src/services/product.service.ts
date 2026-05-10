import { CartItem, Product } from "@/types/product.types";
import { API_BASE_URL } from "./api";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `${token ?? ""}`,
    "Content-Type": "application/json",
  };
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/productlist/${category}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const fetchUserCart = async (): Promise<{ items: Product[] }> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { items: [] };
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const addProductToCart = async (product: Product, quantity: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      items: [{ _id: product._id, name: product.name, price: product.price, quantity }],
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to add item to cart");
  }
};

export const toReduxCartItems = (items: Product[]): CartItem[] => {
  return items as CartItem[];
};
