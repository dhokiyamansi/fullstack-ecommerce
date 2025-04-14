"use client";
import { setReduxCartItems } from "@/store/cartSlice";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartItem extends Product {
  quantity: number;
}


const ProductDetails = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{ items: Product[] }>({ items: [] });

  // Sorting State
  const [sortCategory, setSortCategory] = useState<string>("");

  // Fetch products from the backend
  useEffect(() => {
    if (!category) return;
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/productlist/${category}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setSortedProducts(data); // Initialize sorted products with fetched data
        // 
      } catch (err) {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Fetch cart from the backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:5000/cart", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);
  const handleSort = (category: string) => {
    setSortCategory(category);
    let sortedArray = [...products];
    if (category === "alphabetical") {
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (category === "price") {
      sortedArray.sort((a, b) => a.price - b.price);
    }
    setSortedProducts(sortedArray);
  };
  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to the cart.");
        return;
      }
      const existingCartItem: any = cart.items.find((item) => item._id === product._id);
      const updatedQuantity = existingCartItem ? existingCartItem.quantity + 1 : 1;
      const requestBody = {
        items: [{ 
          _id: product._id, 
          name: product.name, 
          price: product.price, 
          quantity: updatedQuantity 
        }],
      };
      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${product.name} added to cart successfully!`);
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) =>
            item._id === product._id ? { ...item, quantity: updatedQuantity } : item
          
          );
          if (!existingCartItem) {
            updatedItems.push({ ...product, quantity: 1 });
          }
          const updatedDispach = updatedItems as CartItem[];
          dispatch(setReduxCartItems(updatedDispach));
          return { items: updatedItems };
          
        });
       
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  if (loading) return <div className="text-center text-2xl mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-xl mt-20">{error}</div>;
  if (!products.length)
    return <div className="text-center text-red-500 text-2xl mt-20">No products found in this category!</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-20">
      <h1 className="text-5xl font-bold text-center mb-6">{category} Products</h1>
      <div className="flex justify-end mb-6">
        <select
          className="p-2 border rounded-lg"
          value={sortCategory}
          onChange={(e) => handleSort(e.target.value)}
        >
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
};

export default ProductDetails;


{/*
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<{ items: Product[] }>({ items: [] });

  useEffect(() => {
    if (!category) return;
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/productlist/${category}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Fetch cart from the backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:5000/cart", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, []);


  // Add to cart function
  const addToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add items to the cart.");
        return;
      }
  
      // Retrieve existing cart from state
      const existingCartItem:any = cart.items.find((item) => item._id === product._id);
      const updatedQuantity = existingCartItem ? existingCartItem.quantity + 1 : 1;
  
      // Prepare the request body
      const requestBody = {
        items: [{ 
          _id: product._id, 
          name: product.name, 
          price: product.price, 
          quantity: updatedQuantity 
        }],
      };
  
      // Send request to backend
      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`${product.name} added to cart successfully!`);
        
        // Update local cart state correctly
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) =>
            item._id === product._id ? { ...item, quantity: updatedQuantity } : item
          );
          if (!existingCartItem) {
            updatedItems.push({ ...product, quantity: 1 });
          }
          return { items: updatedItems };
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };
  
  

  if (loading) return <div className="text-center text-2xl mt-20">Loading</div>;

  if (error) return <div className="text-center text-red-500 text-xl mt-20">{error}</div>;

  if (!products.length)
    return <div className="text-center text-red-500 text-2xl mt-20">No products found in this category!</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-20">
      <h1 className="text-5xl font-bold text-center mb-6">{category} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-6 rounded-lg shadow-md text-center">
            <img src={product.image} alt={product.name} className="w-full h-60 object-cover mb-3 rounded" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold text-gray-800 mt-4">₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-800 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
*/}



