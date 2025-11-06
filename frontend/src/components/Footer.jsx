import React from "react";
import * as lucideReact from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-amber-50 text-gray-700 border-t border-amber-200 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-amber-600">CaterEase</h2>
          <p className="mt-3 text-sm text-gray-600">
            Making every event deliciously memorable.  
            Quality catering for weddings, parties, and celebrations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-amber-600">Home</Link></li>
            <li><Link to="/menus" className="hover:text-amber-600">Menu</Link></li>
            <li><Link to="/bookings" className="hover:text-amber-600">Booking</Link></li>
            <li><Link to="/contact" className="hover:text-amber-600">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-amber-600"><lucideReact.Instagram size={22} /></a>
            <a href="#" className="hover:text-amber-600"><lucideReact.Facebook size={22} /></a>
            <a href="#" className="hover:text-amber-600"><lucideReact.Twitter size={22} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-200 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} CaterEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
