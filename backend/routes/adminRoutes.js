import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── GET /api/admin/overview ───────────────────────────────────
router.get("/overview", protect, admin, async (req, res) => {
  try {
    const [
      totalBookings, pending, confirmed, completed, cancelled,
      revenueAgg, upcomingCount
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
      ]),
      Booking.countDocuments({
        eventDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        status: { $in: ["pending", "confirmed"] }, // ✅ FIXED: was "eventStatus"
      }),
    ]);

    res.json({
      totalBookings, pending, confirmed, completed, cancelled,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      upcomingCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── GET /api/admin/bookings ───────────────────────────────────
router.get("/bookings", protect, admin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const per  = Math.min(100, parseInt(req.query.per || "20"));

    const [items, total] = await Promise.all([
      Booking.find()
        .populate("menuIds", "title price")
        .sort({ eventDate: -1 })
        .skip((page - 1) * per)
        .limit(per)
        .lean(),
      Booking.countDocuments(),
    ]);

    res.json({ items, page, per, total, pages: Math.ceil(total / per) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/admin/bookings/:id/status ─────────────────────
router.patch("/bookings/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/orders ─────────────────────────────────────
router.get("/orders", protect, admin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const per  = Math.min(100, parseInt(req.query.per || "20"));

    const [items, total] = await Promise.all([
      Order.find()
        .populate("menuItems", "title price")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * per)
        .limit(per)
        .lean(),
      Order.countDocuments(),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / per) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/admin/orders/:id/status ───────────────────────
router.patch("/orders/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    // ✅ Matches Order.js enum (lowercase)
    const allowed = ["pending", "preparing", "delivered", "cancelled"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────
router.get("/users", protect, admin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const per  = Math.min(100, parseInt(req.query.per || "20"));

    const [items, total] = await Promise.all([
      User.find()
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip((page - 1) * per)
        .limit(per)
        .lean(),
      User.countDocuments(),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / per) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;