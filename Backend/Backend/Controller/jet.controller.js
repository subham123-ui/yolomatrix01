// src/controllers/jet.controller.ts

import { Jet } from "../Models/luxary.model.js";
import { uploadToCloudinary } from "../Config/cloudenary.config.js";

//! Get all jets
export const getAllJets = async (req, res) => {
  try {
    const allJets = await Jet.find();
    res.json({ success: true, jets: allJets });
  } catch (error) {
    console.error("Error fetching jets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Get jet by ID
export const getJetById = async (req, res) => {
  try {
    const { id } = req.params;
    const jet = await Jet.findById(id);

    if (!jet) {
      return res.status(404).json({ success: false, message: "Jet not found" });
    }

    res.json({ success: true, jet });
  } catch (error) {
    console.error("Error fetching jet:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Create a new jet
export const createJet = async (req, res) => {
  try {
    const { title, description, price, location, amenities, available } = req.body;

    const files = req.files;
    let imageUrls = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    const parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;

    const newJet = new Jet({
      title,
      description,
      price: parseInt(price),
      location,
      amenities: parsedAmenities,
      images: imageUrls,
      available: available === "true" || available === true,
    });

    await newJet.save();

    res.status(201).json({ success: true, jet: newJet });
  } catch (error) {
    console.error("Error creating jet:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Update a jet
export const updateJet = async (req, res) => {
  try {
    const { id } = req.params;
    const existingJet = await Jet.findById(id);

    if (!existingJet) {
      return res.status(404).json({ success: false, message: "Jet not found" });
    }

    const { title, description, price, location, amenities, available } = req.body;

    let imageUrls = existingJet.images || [];

    // Handle file uploads if they exist
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    // Update fields with default or incoming values
    existingJet.title = title || existingJet.title;
    existingJet.description = description || existingJet.description;
    existingJet.price = price ? parseInt(price) : existingJet.price;
    existingJet.location = location || existingJet.location;

    // Handle amenities parsing: ensure it's a valid JSON string
    if (amenities) {
      try {
        // Check if amenities is a string, and only parse if it is
        existingJet.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid amenities format" });
      }
    }

    existingJet.available = (available !== undefined) 
      ? (available === "true" || available === true)
      : existingJet.available;
    existingJet.images = imageUrls;

    await existingJet.save();

    return res.json({ success: true, jet: existingJet });
  } catch (error) {
    console.error("Error updating jet:", error);
    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
};

//! Delete a jet
export const deleteJet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJet = await Jet.findByIdAndDelete(id);

    if (!deletedJet) {
      return res.status(404).json({ success: false, message: "Jet not found" });
    }

    res.json({ success: true, message: "Jet deleted successfully" });
  } catch (error) {
    console.error("Error deleting jet:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
