"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    payment: "credit-card",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Remove error when the user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Order Placed Successfully!");
          router.push("/thankyou");
        } else {
          alert("Error placing order!");
        }
      } catch (error) {
        console.error("Failed to place order:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-24 bg-gray-100">
      <h2 className="text-4xl font-semibold mb-6">Checkout</h2>
      <div className="w-4/5 flex flex-col md:flex-row gap-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold">Contact Details</h3>

          {/** Full Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className={`w-full p-4 border rounded-md ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/** Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full p-4 border rounded-md ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/** Phone Number */}
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className={`w-full p-4 border rounded-md ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/** Address */}
          <div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className={`w-full p-4 border rounded-md ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="flex gap-4">
            {/** City */}
            <div className="w-1/2">
              <input
                type="text"
                name="city"
                placeholder="City"
                onChange={handleChange}
                className={`w-full p-4 border rounded-md ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            {/** ZIP Code */}
            <div className="w-1/2">
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                onChange={handleChange}
                className={`w-full p-4 border rounded-md ${errors.zip ? "border-red-500" : ""}`}
              />
              {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold">Payment Method</h3>
          <select name="payment" onChange={handleChange} className="w-full p-5 border rounded-md">
          <option value="cod">Cash on Delivery</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-800 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;



{/*
import { useState } from "react";
import { useRouter } from "next/navigation"; 

const CheckoutPage = () => {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    payment: "credit-card",
  });
  
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    zip: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: !formData.name,
      email: !formData.email,
      phone: !formData.phone,
      address: !formData.address,
      city: !formData.city,
      zip: !formData.zip,
    };
    setErrors(newErrors);
  

    if (!Object.values(newErrors).includes(true)) {
      try {
        const response = await fetch("http://localhost:5000/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Order Placed Successfully!");
          router.push("/thankyou");
        } else {
          alert("Error placing order!");
        }
      } catch (error) {
        console.error("Failed to place order:", error);
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen py-24 bg-gray-100">
      <h2 className="text-4xl font-semibold mb-6">Checkout</h2>
      <div className="w-4/5 flex flex-col md:flex-row gap-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold">Contact Details</h3>
          <input type="text" name="name" placeholder="Full Name"  onChange={handleChange} 
            className={`w-full p-4 border rounded-md ${errors.name ? 'border-red-500' : ''}`}  />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} 
            className={`w-full p-4 border rounded-md ${errors.email ? 'border-red-500' : ''}`} />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} 
            className={`w-full p-4 border rounded-md ${errors.phone ? 'border-red-500' : ''}`} />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} 
            className={`w-full p-4 border rounded-md ${errors.address ? 'border-red-500' : ''}`} />
          <div className="flex gap-4">
            <input type="text" name="city" placeholder="City" onChange={handleChange} 
              className={`w-1/2 p-4 border rounded-md ${errors.city ? 'border-red-500' : ''}`} />
            <input type="text" name="zip" placeholder="ZIP Code" onChange={handleChange} 
              className={`w-1/2 p-4 border rounded-md ${errors.zip ? 'border-red-500' : ''}`} />
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold">Payment Method</h3>
          <select name="payment" onChange={handleChange} className="w-full p-5 border rounded-md">
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          <button onClick={handleSubmit} className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-800 transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
*/}