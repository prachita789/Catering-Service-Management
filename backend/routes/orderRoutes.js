import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all orders for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("booking")
      .populate("menuItems")
      .sort({ createdAt: -1 }); // newest first
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
      user: req.user._id,
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

// GET single order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate("booking")
      .populate("menuItems");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// PATCH cancel an order (user can only cancel their own pending orders)
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
});

export default router;