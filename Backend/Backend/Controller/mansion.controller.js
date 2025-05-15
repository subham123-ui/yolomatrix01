import { uploadToCloudinary } from "../Config/cloudenary.config.js";
import { Mansion } from "../Models/luxary.model.js";

// Get all mansions
export const getAllMansions = async (req, res) => {
  try {
    const allMansions = await Mansion.find();
    res.json({ success: true, mansions: allMansions });
  } catch (error) {
    console.error("Error fetching mansions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get mansion by ID
export const getMansionById = async (req, res) => {
  try {
    const { id } = req.params;
    const mansion = await Mansion.findById(id);

    if (!mansion) {
      res.status(404).json({ success: false, message: "Mansion not found" });
      return;
    }

    res.json({ success: true, mansion });
  } catch (error) {
    console.error("Error fetching mansion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new mansion
export const createMansion = async (req, res) => {
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

    const newMansion = new Mansion({
      title,
      description,
      price: parseInt(price),
      location,
      amenities: parsedAmenities,
      images: imageUrls,
      available: available === "true" || available === true,
    });

    await newMansion.save();
    res.status(201).json({ success: true, mansion: newMansion });
  } catch (error) {
    console.error("Error creating mansion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update mansion
export const updateMansion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, amenities, available } = req.body;

    const existingMansion = await Mansion.findById(id);

    if (!existingMansion) {
      res.status(404).json({ success: false, message: "Mansion not found" });
      return;
    }

    const files = req.files;
    let imageUrls = existingMansion.images;

    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      const newImageUrls = uploadResults.map(result => result.secure_url);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    const parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;

    existingMansion.title = title || existingMansion.title;
    existingMansion.description = description || existingMansion.description;
    existingMansion.price = price ? parseInt(price) : existingMansion.price;
    existingMansion.location = location || existingMansion.location;
    existingMansion.amenities = parsedAmenities || existingMansion.amenities;
    existingMansion.images = imageUrls;
    existingMansion.available = available !== undefined
      ? available === "true" || available === true
      : existingMansion.available;

    await existingMansion.save();
    res.json({ success: true, mansion: existingMansion });
  } catch (error) {
    console.error("Error updating mansion:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete mansion
export const deleteMansion = async (req, res) => {
  try {
    const { id } = req.params;
    const existingMansion = await Mansion.findById(id);

    if (!existingMansion) {
      res.status(404).json({ success: false, message: "Mansion not found" });
      return;
    }

    await Mansion.findByIdAndDelete(id);
    res.json({ success: true, message: "Mansion deleted successfully" });
  } catch (error) {
    console.error("Error deleting mansion:", error);
    res.status(500).json({ message: "Server error" });
  }
};
