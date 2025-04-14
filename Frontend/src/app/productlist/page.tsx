"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { id: 1, name: "Footwear" },
  { id: 2, name: "Clothes" },
  { id: 3, name: "Home Appliances" },
  { id: 4, name: "Sports" },
  { id: 5, name: "Books" },
  { id: 6, name: "Beauty Products" },
  { id: 7, name: "Toys & Games" },
  { id: 8, name: "Personal Care" },
  { id: 9, name: "Furniture" },
  { id: 10, name: "Electronics" },
  { id: 11, name: "Spectacles" },
  { id: 12, name: "Fitness" },
];

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-200 p-28">
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search categories..."
          className="w-1/2 px-4 py-3 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-500 hover:text-white transition cursor-pointer text-center text-xl font-semibold"
            onClick={() => router.push(`/productdetails?category=${category.name}`)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
