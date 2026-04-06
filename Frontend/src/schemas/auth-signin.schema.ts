import { SignInCredentials } from "@/types/auth.types";

export const isSignInFormValid = (values: SignInCredentials): boolean => {
  return values.email.trim().length > 0 && values.password.trim().length > 0;
};
