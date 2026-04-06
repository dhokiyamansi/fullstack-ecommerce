import { CheckoutFormData, CheckoutFormErrors } from "@/types/checkout.types";

export const validateCheckoutForm = (formData: CheckoutFormData): CheckoutFormErrors => {
  const newErrors: CheckoutFormErrors = {};

  Object.keys(formData).forEach((field) => {
    if (!formData[field as keyof CheckoutFormData]) {
      newErrors[field] = "This field is required";
    }
  });

  return newErrors;
};
