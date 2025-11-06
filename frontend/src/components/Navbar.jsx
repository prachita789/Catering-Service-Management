import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Get user info (for login state)
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // ✅ Add "My Bookings" link to nav
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menus" },
    { name: "Booking", path: "/booking" },
    { name: "My Bookings", path: "/my-bookings" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <nav className="bg-white/60 backdrop-blur-lg shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* 🍽️ Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-amber-600 tracking-wide"
          >
            🍽️ CaterEase
          </Link>

          {/* 🌐 Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-amber-600 transition"
              >
                {link.name}
              </Link>
            ))}

            {/* 👤 Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* 📱 Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-amber-600"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/70 backdrop-blur-md shadow-md">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-gray-800 hover:text-amber-600"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-gray-300" />

            {isLoggedIn ? (
              <>
                <p className="text-gray-700">Hi, {user?.name?.split(" ")[0]}</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-800 hover:text-amber-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block bg-amber-600 text-white text-center px-4 py-2 rounded-lg hover:bg-amber-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
