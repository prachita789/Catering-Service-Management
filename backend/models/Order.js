import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    totalPrice: { type: Number, required: true },
    status: {
  type: String,
  enum: ["pending", "preparing", "delivered", "cancelled"],
  default: "pending",
}
,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
