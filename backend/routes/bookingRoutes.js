import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Menu from "../models/Menu.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all bookings (for logged-in user)
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email }).populate("menuIds");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// POST: Create new booking + linked order
router.post("/", protect, async (req, res) => {
  try {
    const { fullName, email, eventType, eventDate, venue, guests, notes, menuIds } = req.body;

    const menus = await Menu.find({ _id: { $in: menuIds } });
    const menuTotal = menus.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = menuTotal * guests;

    const booking = new Booking({
      fullName,
      email,
      eventType,
      eventDate,
      venue,
      guests,
      notes,
      menuIds,
      totalPrice,
    });
    await booking.save();

    const order = new Order({
      user: req.user._id,
      booking: booking._id,
      menuItems: menuIds,
      totalPrice,
      status: "pending",
    });
    await order.save();

    res.status(201).json({
      message: "Booking and Order created successfully!",
      booking,
      order,
    });
  } catch (error) {
    console.error("Booking creation failed:", error);
    res.status(400).json({ message: "Error creating booking/order", error });
  }
});

// CANCEL BOOKING (PUT THIS OUTSIDE the POST route!)
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      email: req.user.email,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Completed bookings cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully!", booking });
  } catch (err) {
    console.error("Cancel failed:", err);
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
});

export default router;
