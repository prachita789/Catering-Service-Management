import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  CalendarDays,
  MapPin,
  Users,
  Eye,
  XCircle,
} from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your bookings.");
      return;
    }
    fetchBookings();
  }, [token]);

  // Cancel Booking
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/bookings/${id}`,
        { status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking.");
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[40vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="text-center text-white px-6">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-200">
            Track and manage your upcoming catering events.
          </p>
        </div>
      </section>

      {/* Booking List Section */}
      <main className="max-w-6xl mx-auto py-16 px-6">
        {loading ? (
          <p className="text-center text-gray-600">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            <p className="text-xl font-medium mb-3">
              You haven’t booked any events yet.
            </p>
            <a
              href="/booking"
              className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
            >
              Book Your First Event
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-amber-700">
                      {b.eventType}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm capitalize ${
                        b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-amber-600" />
                      {new Date(b.eventDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      {b.venue}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      {b.guests} Guests
                    </p>

                    {/* 💵 Total Payment */}
                    <p className="flex items-center gap-2 font-semibold text-amber-700 mt-2">
                      💵 Total: ₹{b.totalPrice || b.guests * 500}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="flex-1 py-2 rounded-lg border border-amber-600 text-amber-700 font-medium hover:bg-amber-600 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                    {b.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-amber-700 mb-4">
              {selectedBooking.eventType} Details
            </h2>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedBooking.eventDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Venue:</strong> {selectedBooking.venue}
            </p>
            <p>
              <strong>Guests:</strong> {selectedBooking.guests}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>

            <div className="mt-3">
              <strong>Selected Menu:</strong>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                {selectedBooking.menuIds?.length > 0 ? (
                  selectedBooking.menuIds.map((m) => (
                    <li key={m._id}>
                      {m.title} – ₹{m.price}
                    </li>
                  ))
                ) : (
                  <li>No menu selected</li>
                )}
              </ul>
            </div>

            {/* 💵 Total Price in Modal */}
            <p className="text-gray-700 mt-3 font-semibold">
              💵 Total Payment: ₹{selectedBooking.totalPrice || selectedBooking.guests * 500}
            </p>

            {selectedBooking.notes && (
              <p className="mt-3 italic text-gray-500">
                “{selectedBooking.notes}”
              </p>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      
    </>
  );
};

export default MyBookings;
