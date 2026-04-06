export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpFormValues extends SignInCredentials {
  username: string;
  confirmPassword: string;
}
