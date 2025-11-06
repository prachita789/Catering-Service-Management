import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all orders for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("booking")
      .populate("menuItems");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// POST new order
router.post("/", protect, async (req, res) => {
  try {
    const { booking, menuItems, totalPrice } = req.body;

    const order = new Order({
      user : req.user._id,
      booking,
      menuItems,
      totalPrice,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Error creating order", error });
  }
});

export default router;
