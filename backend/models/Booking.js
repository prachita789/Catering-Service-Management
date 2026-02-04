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

    // Date & time of event (stored in UTC)
    eventDate: { type: Date, required: true },
    // Optional: store client's timezone like "Asia/Kolkata"
    timezone: { type: String, default: "UTC" },

    // Simple venue name (banquet, hall, etc.)
    venue: { type: String, required: true },

    // NEW: structured address (optional but useful)
    address: {
      fullAddress: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: "India" },
    },

    // NEW: GeoJSON for map / distance (optional)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },

    guests: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },

    notes: { type: String },

    menuIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

    // status used by admin dashboard
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// // for location queries (optional)
// bookingSchema.index({ location: "2dsphere" });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
