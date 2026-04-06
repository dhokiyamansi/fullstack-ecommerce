"use client";

import { setReduxCartItems } from "@/store/cartSlice";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addProductToCart,
  fetchProductsByCategory,
  fetchUserCart,
  toReduxCartItems,
} from "@/services/product.service";
import { Product } from "@/types/product.types";

export default function ProductDetailsPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{ items: Product[] }>({ items: [] });
  const [sortCategory, setSortCategory] = useState<string>("");

  useEffect(() => {
    if (!category) return;
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory(category);
        setProducts(data);
        setSortedProducts(data);
      } catch {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await fetchUserCart();
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    loadCart();
  }, []);

  const handleSort = (selected: string) => {
    setSortCategory(selected);
    const sortedArray = [...products];
    if (selected === "alphabetical") sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    if (selected === "price") sortedArray.sort((a, b) => a.price - b.price);
    setSortedProducts(sortedArray);
  };

  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to the cart.");
        return;
      }

      const existingCartItem = cart.items.find((item) => item._id === product._id);
      const updatedQuantity = existingCartItem ? (existingCartItem.quantity ?? 0) + 1 : 1;

      await addProductToCart(product, updatedQuantity);
      alert(`${product.name} added to cart successfully!`);

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) =>
          item._id === product._id ? { ...item, quantity: updatedQuantity } : item,
        );
        if (!existingCartItem) updatedItems.push({ ...product, quantity: 1 });
        dispatch(setReduxCartItems(toReduxCartItems(updatedItems)));
        return { items: updatedItems };
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart.");
    }
  };

  if (loading) return <div className="text-center text-2xl mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-xl mt-20">{error}</div>;
  if (!products.length) return <div className="text-center text-red-500 text-2xl mt-20">No products found in this category!</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-20">
      <h1 className="text-5xl font-bold text-center mb-6">{category}</h1>
      <div className="flex justify-end mb-6">
        <select className="p-2 border rounded-lg" value={sortCategory} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort Products</option>
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="price">Price (Low to High)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md text-center">
            <img src={product.image} alt={product.name} className="w-full h-60 object-cover mb-2 rounded" />
            <div className="grid grid-rows-3 pb-4 px-4">
              <h2 className="text-lg font-semibold break-words ">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <div>
                <p className="text-lg font-bold text-gray-800">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto bg-blue-500 text-white px-4 py-2 rounded w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-800 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
