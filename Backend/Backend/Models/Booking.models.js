import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["mansion", "apartment", "jet", "yacht", "concierge"],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemType",
    },
    customerName: { type: String, required: true, maxlength: 255 },
    customerEmail: { type: String, required: true, maxlength: 255 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model("Booking", bookingSchema);
