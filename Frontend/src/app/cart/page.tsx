"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setReduxCartItems } from "../../store/cartSlice";


interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch("http://localhost:5000/cart/", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }
      const data = await response.json();
      console.log("cart response",data.items);
      
      if (data && Array.isArray(data.items)) {
        setCartItems(data.items); 
        dispatch(setReduxCartItems(data.items)); // ✅ Send data to Redux

      } else {
        console.error("Invalid cart data format:", data);
        
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  
  const updateCart = (items: CartItem[]) => {
    fetchCart();
  };

  const increaseQuantity = async (id: string) => {
    try {
      console.log("increase product id",id);
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/cart/increase/${id}`, {
            method: "POST",
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json", 
            },
        });
        const data = await response.json(); 
        if (!response.ok) {
            throw new Error(data.message || "Failed to increase quantity");
        }
        fetchCart();
    } catch (error) {
        console.error("Error increasing quantity:", error instanceof Error ? error.message : error);
        alert("Could not update quantity. Please try again.");
    }
};


const decreaseQuantity = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        console.log("token object",token);
        const response = await fetch(`http://localhost:5000/cart/decrease/${id}`, {
            method: "POST",
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to decrease quantity");
        }
        fetchCart();
    } catch (error) {
        console.error("Error decreasing quantity:", error instanceof Error ? error.message : error);
        alert("Could not update quantity. Please try again.");
    }
};


const removeItem = async (id: string) => {
        const token = localStorage.getItem("token");
        const removeItem = await fetch(`http://localhost:5000/cart/remove/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));;
        fetchCart();
};


  const totalPrice = Array.isArray(cartItems) 
  ? cartItems.reduce((total, item) => {
      const price = item?.price ?? 0; 
      const quantity = item?.quantity ?? 1; 
      return total + price * quantity;
    }, 0)
  : 0;


  const onCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Add items before proceeding.");
      return;
    }
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/cart/add", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items:cartItems }),
    });
    const data = await response.json();
    console.log("Cart data", data);
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
                  <button onClick={() => decreaseQuantity(item._id)} className="px-2 py-1 bg-gray-300 rounded-md">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)} className="px-2 py-1 bg-gray-300 rounded-md">+</button>
                </div>
                <span className="font-medium">₹{item.price * item.quantity}</span>
                <button onClick={() => removeItem(item._id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Remove</button>
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
};

export default CartPage;


