"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateCheckoutForm } from "@/schemas/checkout.schema";
import { placeOrder } from "@/services/checkout.service";
import { CheckoutFormData, CheckoutFormErrors } from "@/types/checkout.types";

const defaultFormData: CheckoutFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  payment: "credit-card",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutFormData>(defaultFormData);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const success = await placeOrder(formData);
      if (success) {
        alert("Order Placed Successfully!");
        router.push("/thankyou");
      } else {
        alert("Error placing order!");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-24 bg-gray-100">
      <h2 className="text-4xl font-semibold mb-6">Checkout</h2>
      <div className="w-4/5 flex flex-col md:flex-row gap-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold">Contact Details</h3>
          {["name", "email", "phone", "address"].map((field) => (
            <div key={field}>
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field as keyof CheckoutFormData]}
                placeholder={field === "name" ? "Full Name" : field[0].toUpperCase() + field.slice(1)}
                onChange={handleChange}
                className={`w-full p-4 border rounded-md ${errors[field] ? "border-red-500" : ""}`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
          <div className="flex gap-4">
            {["city", "zip"].map((field) => (
              <div key={field} className="w-1/2">
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof CheckoutFormData]}
                  placeholder={field === "zip" ? "ZIP Code" : "City"}
                  onChange={handleChange}
                  className={`w-full p-4 border rounded-md ${errors[field] ? "border-red-500" : ""}`}
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-2xl font-semibold">Payment Method</h3>
          <select name="payment" value={formData.payment} onChange={handleChange} className="w-full p-5 border rounded-md">
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
}
