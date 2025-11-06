import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero-food.jpg"; 
import paneerImg from "../assets/menu/paneer-butter-masala.jpg";
import biryaniImg from "../assets/menu/biryani.jpg";
import lavaCakeImg from "../assets/menu/chocolate-lava-cake.jpg";
import { Utensils, Clock, Users } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* 🌟 Hero Section */}
      <section
        className="relative bg-cover bg-center h-[90vh] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImg})`,
        }}
      >
        <div className="text-center text-white max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-4">
            Making Every Event Deliciously Memorable
          </h1>
          <p className="text-lg mb-6">
            From weddings to corporate events, we bring exquisite flavors and
            seamless service to your table.
          </p>
          <Link
            to="/booking"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Book Your Event
          </Link>
        </div>
      </section>

      {/* 🍴 Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Why Choose <span className="text-orange-600">CaterEase</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 px-6">
            <div className="bg-white shadow-md rounded-xl p-8 hover:shadow-lg transition">
              <Utensils className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Exquisite Cuisine</h3>
              <p className="text-gray-600">
                Our chefs craft dishes using the freshest ingredients and
                authentic recipes for a truly unforgettable taste.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-8 hover:shadow-lg transition">
              <Clock className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Timely Service</h3>
              <p className="text-gray-600">
                We ensure everything runs smoothly — from preparation to serving
                — so your event stays stress-free.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-8 hover:shadow-lg transition">
              <Users className="w-10 h-10 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Experienced Team</h3>
              <p className="text-gray-600">
                Our passionate team brings years of catering experience to
                deliver exceptional hospitality every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🍲 Menu Preview Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Explore Our <span className="text-orange-600">Signature Dishes</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 px-6">
            {[
              {
                name: "Paneer Butter Masala",
                img: paneerImg,
                price: "₹250",
              },
              {
                name: "Biryani Royale",
                img: biryaniImg,
                price: "₹300",
              },
              {
                name: "Chocolate Lava Cake",
                img: lavaCakeImg,
                price: "₹180",
              },
            ].map((dish, index) => (
              <div
                key={index}
                 className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden animate-fadeIn"
              >
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-5 text-left">
                  <h3 className="font-semibold text-lg mb-2">{dish.name}</h3>
                  <p className="text-orange-600 font-medium">{dish.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/menus"
              className="text-orange-600 font-semibold hover:underline"
            >
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* 📢 CTA Banner */}
      <section className="bg-orange-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Plan Your Perfect Event?
        </h2>
        <p className="mb-6 text-lg">
          Let’s make your special day unforgettable with delicious food and
          flawless service.
        </p>
        <Link
          to="/booking"
          className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Book Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
