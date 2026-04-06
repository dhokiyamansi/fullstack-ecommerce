"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSignInFormValid } from "@/schemas/auth-signin.schema";
import { loginUser } from "@/services/auth.service";
import { SignInCredentials } from "@/types/auth.types";

export default function SigninPage() {
  const router = useRouter();
  const [user, setUser] = useState<SignInCredentials>({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const token = await loginUser(user);
      localStorage.setItem("token", token);
      router.push("/productlist");
    } catch (error: any) {
      console.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!isSignInFormValid(user));
  }, [user]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">{loading ? "Processing..." : "Login"}</h2>
        <div className="flex flex-col gap-6">
          <label htmlFor="email" className="font-medium">
            Email*
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            id="email"
            name="email"
            type="text"
            value={user.email}
            onChange={onChange}
            placeholder="Enter your email"
          />
          <label htmlFor="password" className="font-medium">
            Password*
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={onChange}
            placeholder="Enter your password"
          />
          <button
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`w-full py-2 rounded-lg ${buttonDisabled ? "bg-blue-600" : "bg-green-600 text-white"}`}
          >
            Login
          </button>
        </div>
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
