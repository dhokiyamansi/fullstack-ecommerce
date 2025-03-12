import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Copyright } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-500 text-white py-8 px-6 w-full relative bottom-0">
      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 text-xl mb-4">
        <div className="hover:text-blue-400 transition cursor-pointer"><Facebook /></div>
        <div className="hover:text-pink-500 transition cursor-pointer"><Instagram /></div>
        <div className="hover:text-blue-500 transition cursor-pointer"><Twitter /></div>
        <div className="hover:text-red-600 transition cursor-pointer"><Youtube /></div>
      </div>

      {/* Contact Details */}
      <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-300 mb-4">
        <div className="flex items-center gap-2">
          <Phone className="text-green-400" size={18} />
          <span>+91 12345 67890</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="text-yellow-400" size={18} />
          <span>contact@shoponline.com</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-red-400" size={18} />
          <span>Ahmedabad, Gujarat, India</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-900 text-xl flex justify-center items-center gap-2">
        <Copyright size={16} />
        <span>2025 E-Commerce. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
