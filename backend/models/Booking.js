import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    eventType: {
      type: String,
      enum: ["Wedding", "Birthday", "Corporate", "Outdoor", "Other"],
      required: true,
    },
    eventDate: { type: Date, required: true },
    venue: { type: String, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },

    notes: { type: String },
    menuIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
