import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Clock, Truck, CheckCircle, XCircle, Utensils } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Please login first to view your orders.");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const statusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        className="relative bg-cover bg-center h-[35vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <h1 className="text-4xl text-white font-bold">My Orders</h1>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-amber-700 mb-6 text-center">
          Track your food orders
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven’t placed any orders yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-600" /> Order
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${statusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Menu items */}
                <ul className="space-y-2 mb-4">
                  {order.menuItems?.map((item) => (
                    <li
                      key={item._id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>{item.title}</span>
                      <span className="font-semibold text-amber-700">
                        ₹{item.price}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-sm text-gray-600 mb-3">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Total:</strong>{" "}
                    <span className="text-amber-700 font-semibold">
                      ₹{order.totalPrice}
                    </span>
                  </p>
                </div>

                {/* Status tracker */}
                <div className="flex items-center justify-between text-sm mt-4">
                  <div
                    className={`flex items-center gap-2 ${
                      order.status === "Pending" ? "text-yellow-600" : ""
                    }`}
                  >
                    <Clock className="w-4 h-4" /> Pending
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      order.status === "Preparing" ? "text-blue-600" : ""
                    }`}
                  >
                    <Truck className="w-4 h-4" /> Preparing
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      order.status === "Delivered" ? "text-green-600" : ""
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" /> Delivered
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      
    </>
  );
};

export default Orders;
