"use client";

import { useRouter } from "next/navigation";

const EndingPage = () => {
  const router = useRouter(); 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-500 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-bold text-gray-600 animate-bounce">Thank You!</h1>
        <p className="text-2xl opacity-80">We appreciate your visit. Come back soon! 😊</p>
        <button 
          onClick={() => router.push("/")} 
          className="mt-3 px-9 py-6 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default EndingPage;
