import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Users, ClipboardList } from "lucide-react";

const BookingForm = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    eventType: "",
    eventDate: "",
    venue: "",
    guests: "",
    menuIds: [],
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // 🥘 Fetch Menus for selection
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menus")
      .then((res) => setMenus(res.data))
      .catch((err) => console.error("Error fetching menus:", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle menu checkbox selection
  const handleMenuSelection = (menuId) => {
    setForm((prev) => {
      const alreadySelected = prev.menuIds.includes(menuId);
      const updatedMenus = alreadySelected
        ? prev.menuIds.filter((id) => id !== menuId)
        : [...prev.menuIds, menuId];
      return { ...prev, menuIds: updatedMenus };
    });
  };

  // 🧠 Submit booking
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      toast.error("Please login to book your event first!");
      setTimeout(() => navigate("/login", { state: { from: "/booking" } }), 2000);
      setLoading(false);
      return;
    }

    // ✅ Include user email and token in request
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.post("http://localhost:5000/api/bookings", form, config);

    toast.success("🎉 Booking confirmed! Your order has been created.", {
      duration: 3000,
    });

    // ✅ Reset form after success
    setForm({
      fullName: "",
      email: "",
      eventDate: "",
      venue: "",
      guests: "",
      menuIds: [],
      notes: "",
    });

    // ✅ Redirect to Orders page
    setTimeout(() => navigate("/orders"), 2500);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-[#fffaf5] min-h-screen text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1546039907-7fa05f864c02?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="text-center text-white max-w-2xl px-4">
          <h1 className="text-4xl font-bold mb-3">Plan Your Perfect Event</h1>
          <p className="text-lg text-gray-200">
            Fill in your details below and we’ll craft a memorable experience for you.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <main className="max-w-3xl mx-auto my-16 bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-lg border border-amber-100">
        <h2 className="text-3xl font-bold text-center text-amber-700 mb-8">
          Event Booking Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block font-medium mb-2">Event Type</label>
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="">-- Select Event Type --</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate">Corporate</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label className="block font-medium mb-2 items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-600" />
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Venue */}
          <div>
            <label className="font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              Venue / Address
            </label>
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="The Royal Banquet Hall"
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="font-medium mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Number of Guests
            </label>
            <input
              type="number"
              name="guests"
              value={form.guests}
              onChange={handleChange}
              placeholder="e.g. 100"
              required
              min="10"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Select Menus */}
          <div>
            <label className="font-medium mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              Select Menu Items
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menus.map((menu) => (
                <label
                  key={menu._id}
                  className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-100"
                >
                  <input
                    type="checkbox"
                    checked={form.menuIds.includes(menu._id)}
                    onChange={() => handleMenuSelection(menu._id)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {menu.title} – ₹{menu.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Mention any special requests or dietary needs"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
          >
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default BookingForm;
