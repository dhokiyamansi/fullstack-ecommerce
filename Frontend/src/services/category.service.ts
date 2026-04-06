import { CategoryItem } from "@/types/product.types";

export const getCategories = (): CategoryItem[] => {
  return [
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
};
