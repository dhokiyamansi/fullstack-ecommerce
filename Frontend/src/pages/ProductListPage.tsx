"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/category.service";

export default function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const categories = getCategories();

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [categories, searchQuery],
  );

  const onSelectCategory = (categoryName: string) => {
    router.push(`/productdetails?category=${encodeURIComponent(categoryName)}`);
  };

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
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
}
