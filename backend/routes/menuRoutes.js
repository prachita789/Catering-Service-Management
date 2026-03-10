import express from "express";
import Menu from "../models/Menu.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all menus (public)
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new menu item (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { title, category, eventType, description, price, image } = req.body;
    const menu = new Menu({ title, category, eventType, description, price, image });
    const saved = await menu.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update menu item (admin only)  ← NEW
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { title, category, eventType, description, price, image } = req.body;
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { title, category, eventType, description, price, image },
      { new: true, runValidators: true }
    );
    if (!menu) return res.status(404).json({ message: "Menu item not found" });
    res.json(menu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE menu item (admin only)  ← NEW
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;