"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const redirectToSignIn = () => {
    router.push("/auth/signin");
  };
  const redirectToSignUp = () => {
    router.push("/auth/signup");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <div className="flex flex-grow justify-center items-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-600 text-center mb-10">
            Welcome
          </h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={redirectToSignIn}
              className="w-full py-4 mb-6 sm:py-5 rounded-lg bg-green-400 hover:bg-green-600 text-white text-lg"
            >
              Sign In
            </button>
            <button
              onClick={redirectToSignUp}
              className="w-full py-4 mb-6 sm:py-5 rounded-lg bg-blue-400 hover:bg-blue-600 text-white text-lg"
            >
              Sign Up
            </button>
          </div>
          <p className="text-center mt-4 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <footer className="bg-gray-500 text-white py-4 text-center"> 
        <p>© 2025 E-Commerce. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
