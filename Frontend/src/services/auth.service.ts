import axios from "axios";
import { SignInCredentials, SignUpFormValues } from "@/types/auth.types";
import { API_BASE_URL } from "./api";

export const signUpUser = async (values: SignUpFormValues): Promise<{ success: boolean }> => {
  const { confirmPassword, ...formData } = values;
  void confirmPassword;

  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return response.json();
};

export const loginUser = async (credentials: SignInCredentials): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data.token;
};
