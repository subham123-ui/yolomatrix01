import mongoose from "mongoose";

const conciergeServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    serviceType: { type: String, required: true, maxlength: 100 },
    available: { type: Boolean, default: true, required: true },
  },
  { timestamps: true }
);

export const ConciergeServiceModel = mongoose.model("ConciergeService", conciergeServiceSchema);
