import mongoose from "mongoose";

// !Luxury Item Base Schema
const luxuryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  amenities: { type: [String], required: true },
  images: { type: [String], required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

//! Update the updatedAt field before saving the document
luxuryItemSchema.pre('save', function(next) { 
  this.updatedAt = Date.now();
  next(); 
});
  
//! Create models for each luxury item
export const Mansion = mongoose.model("Mansion", luxuryItemSchema);
export const Apartment = mongoose.model("Apartment", luxuryItemSchema);
export const Jet = mongoose.model("Jet", luxuryItemSchema);
export const Yacht = mongoose.model("Yacht", luxuryItemSchema);
export const Concierge = mongoose.model("Concierge", luxuryItemSchema);
