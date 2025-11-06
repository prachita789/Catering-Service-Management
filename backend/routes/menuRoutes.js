import express from "express";
import Menu from "../models/Menu.js";

const router = express.Router();

// GET all menus
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new menu item
router.post("/", async (req, res) => {
  try {
    const { title, category, eventType, description, price, image } = req.body;
    const menu = new Menu({ title, category, eventType, description, price, image });
    const savedMenu = await menu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
