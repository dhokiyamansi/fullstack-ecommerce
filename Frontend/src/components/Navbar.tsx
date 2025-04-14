"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";


const LogoutButton = () => {
  const router = useRouter(); 
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    alert("Logged out successfully!");
    router.push("/auth/signin"); 
  };
  return (
    <button onClick={handleLogout} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-red-600 dark:hover:bg-red-700 dark:border-gray-500">
      <LogOut size={20} />
      Logout
    </button>
  );
};

const Navbar = () => {
  const cartCount = useSelector((state: RootState) => state.cart.cartCount);
  return (
    <nav className="bg-gray-600 dark:bg-gray-800 text-white py-4 px-6 w-full fixed top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-bold tracking-wide hover:text-yellow-400 dark:hover:text-yellow-300 transition cursor-pointer">
          SHOP ONLINE
        </div>
        <div className="hidden md:block text-sm font-semibold text-gray-300 dark:text-gray-400">
          START BUYING WITH <span className="text-yellow-400 dark:text-yellow-300">SHOP ONLINE</span> TODAY!
        </div>
        <div className="flex items-center gap-4 text-lg">
          <div className="flex items-center gap-1 hover:text-yellow-400 dark:hover:text-yellow-300 text-2xl">
            {cartCount}
            <Link href="/cart" className="hover:text-yellow-400 dark:hover:text-yellow-300 transition cursor-pointer">
              <ShoppingCart />
            </Link>
          </div>
          <div className="hover:text-yellow-400 dark:hover:text-yellow-300 transition cursor-pointer">
            <User />
          </div>
          
          <LogoutButton />
          <button className="md:hidden hover:text-yellow-400 dark:hover:text-yellow-300 transition cursor-pointer">
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;