import { CheckoutFormData } from "@/types/checkout.types";
import { API_BASE_URL } from "./api";

export const placeOrder = async (formData: CheckoutFormData): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return response.ok;
};
