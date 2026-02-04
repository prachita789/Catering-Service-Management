
import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Menu from "../models/Menu.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // protect + admin middlewares

const router = express.Router();

// GET /api/admin/overview
// returns counts and revenue summary and upcoming bookings count
router.get("/overview", protect, admin, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
const confirmed = await Booking.countDocuments({ status: "confirmed" });
const completed = await Booking.countDocuments({ status: "completed" });
const cancelled = await Booking.countDocuments({ status: "cancelled" });


    // revenue (sum of totalPrice in Orders or Bookings)
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = (revenueAgg[0] && revenueAgg[0].totalRevenue) || 0;

    // upcoming bookings (next 14 days)
    const now = new Date();
    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
    const upcomingCount = await Booking.countDocuments({
      eventDate: { $gte: now, $lte: inTwoWeeks },
      eventStatus: { $in: ["pending", "confirmed"] },
    });

    res.json({
      totalBookings,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
      upcomingCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/admin/bookings?page=1&per=20
router.get("/bookings", protect, admin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const per = Math.min(100, parseInt(req.query.per || "20"));
    const skip = (page - 1) * per;

    const [items, total] = await Promise.all([
      Booking.find()
        .populate("menuIds", "title price")
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(per)
        .lean(),
      Booking.countDocuments(),
    ]);

    res.json({ items, page, per, total, pages: Math.ceil(total / per) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/bookings/:id/status  { status: "confirmed" }
router.patch("/bookings/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/bookings/calendar
// returns lightweight event objects for FullCalendar or UI
router.get("/bookings/calendar", protect, admin, async (req, res) => {
  try {
    const items = await Booking.find({}).select("fullName eventDate eventStatus guests location").lean();
    const events = items.map((it) => ({
      id: it._id,
      title: `${it.fullName} (${it.guests})`,
      start: it.eventDate,
      status: it.status,
      coords: it.location ? it.location.coordinates : null,
    }));
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
