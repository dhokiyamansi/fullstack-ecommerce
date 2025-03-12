"use client"
import Link from "next/link";
import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


interface IUser {
  email: string;
  password: string;
}


export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUser>({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/auth/login", user);
      localStorage.setItem("token", response.data.token);
      router.push('/productlist')
    } catch (error: any) {
      console.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.trim().length > 0 && user.password.trim().length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  },[user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">{loading ? "Processing..." : "Login"}</h2>
        <div className="flex flex-col gap-6">
          <label htmlFor="email" className="font-medium">Email*</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            id="email"
            type="text"
            value={user.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
          <label htmlFor="password" className="font-medium">Password*</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            id="password"
            type="password"
            value={user.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, password: e.target.value })}
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
          Don't have an account? <Link href="/auth/signup" className="text-blue-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}