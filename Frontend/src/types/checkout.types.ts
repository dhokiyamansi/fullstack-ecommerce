export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  payment: string;
}

export type CheckoutFormErrors = Record<string, string>;
