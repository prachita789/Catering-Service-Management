import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menus" },
  ];

  const customerLinks = [
    { name: "Booking",     path: "/booking" },
    { name: "My Bookings", path: "/my-bookings" },
    { name: "Orders",      path: "/orders" },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin" },
  ];

  // Admin sees only public + admin links (not customer links)
  const navLinks = user
    ? isAdmin
      ? [...publicLinks, ...adminLinks]
      : [...publicLinks, ...customerLinks]
    : publicLinks;

  return (
    <nav className="bg-white/60 backdrop-blur-lg shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-amber-600 tracking-wide cursor-pointer">
            CaterEase
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-amber-600 transition cursor-pointer"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                {/* Avatar → Profile page */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-amber-600 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">
                    Hi, {user?.name?.split(" ")[0] || "User"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login"    className="text-gray-700 hover:text-amber-600 transition cursor-pointer">Login</Link>
                <Link to="/register" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition cursor-pointer">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-amber-600 cursor-pointer"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/70 backdrop-blur-md shadow-md">
          <div className="px-6 py-4 space-y-2">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-gray-800 hover:text-amber-600 py-1 cursor-pointer"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-gray-300" />

            {user ? (
              <>
                {/* Profile link in mobile */}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-amber-600 py-1 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>Hi, {user?.name?.split(" ")[0]}</span>
                </Link>

                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="block text-gray-800 hover:text-amber-600 cursor-pointer">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}
                  className="block bg-amber-600 text-white text-center px-4 py-2 rounded-lg hover:bg-amber-700 cursor-pointer">
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