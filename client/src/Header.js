import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black py-4 px-8 shadow-lg flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {/* Link KartScan to home page */}
        <Link to="/" className="text-2xl font-bold tracking-widest">
          <span className="text-blue-400">Kart</span>
          <span className="text-yellow-400">Scan</span>
        </Link>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-white hover:text-yellow-400">
          Home
        </Link>
        <Link to="/upload" className="text-white hover:text-yellow-400">
          Upload
        </Link>
        <Link to="/contact" className="text-white hover:text-yellow-400">
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
