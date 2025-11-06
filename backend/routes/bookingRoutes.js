import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Menu from "../models/Menu.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all bookings (for logged-in user)
router.get("/", protect, async (req, res) => {
  try {
    // Find bookings created by the logged-in user's email
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

    // Fetch selected menu items from DB
    const menus = await Menu.find({ _id: { $in: menuIds } });

    // Calculate total price (per-person * guest count)
    const menuTotal = menus.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = menuTotal * guests;

    //Create Booking
    const booking = new Booking({
      fullName,
      email,
      eventType,
      eventDate,
      venue,
      guests,
      notes,
      menuIds,
      totalPrice, // store total for display
    });
    await booking.save();

    // Create linked Order (for Orders page)
    const order = new Order({
      user: req.user._id, // <-- keep consistent with orderRoutes.js
      booking: booking._id,
      menuItems: menuIds,
      totalPrice,
      status: "Pending",
    });
    await order.save();

    res.status(201).json({
      message: "✅ Booking and Order created successfully!",
      booking,
      order,
    });
  } catch (error) {
    console.error("Booking creation failed:", error);
    res.status(400).json({ message: "Error creating booking/order", error });
  }
});

export default router;
