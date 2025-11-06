import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // Starters, Main Course, Desserts, etc.
  eventType: { type: String, default: "All" }, // Wedding, Corporate, Birthday, etc.
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }, 
});

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
