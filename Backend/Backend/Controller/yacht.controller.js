import { Yacht } from "../Models/luxary.model.js";
import { uploadToCloudinary } from "../Config/cloudenary.config.js";

//! Get all yachts
export const getAllYachts = async (req, res) => {
  try {
    const allYachts = await Yacht.find();
    res.json({ success: true, yachts: allYachts });
  } catch (error) {
    console.error("Error fetching yachts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Get yacht by ID
export const getYachtById = async (req, res) => {
  try {
    const { id } = req.params;
    const yacht = await Yacht.findById(id);

    if (!yacht) {
      return res.status(404).json({ success: false, message: "Yacht not found" });
    }

    res.json({ success: true, yacht });
  } catch (error) {
    console.error("Error fetching yacht:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Create a new yacht
export const createYacht = async (req, res) => {
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

    const newYacht = new Yacht({
      title,
      description,
      price: parseInt(price),
      location,
      amenities: parsedAmenities,
      images: imageUrls,
      available: available === "true" || available === true,
    });

    await newYacht.save();

    res.status(201).json({ success: true, yacht: newYacht });
  } catch (error) {
    console.error("Error creating yacht:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Update a yacht
export const updateYacht = async (req, res) => {
  try {
    const { id } = req.params;
    const existingYacht = await Yacht.findById(id);

    if (!existingYacht) {
      return res.status(404).json({ success: false, message: "Yacht not found" });
    }

    const { title, description, price, location, amenities, available } = req.body;

    let imageUrls = existingYacht.images;

    const files = req.files;
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    // Handle updates
    existingYacht.title = title ?? existingYacht.title;
    existingYacht.description = description ?? existingYacht.description;
    existingYacht.price = price ? parseInt(price) : existingYacht.price;
    existingYacht.location = location ?? existingYacht.location;

    // ✅ Safe handling of amenities whether it's a string or an array
    if (amenities) {
      if (typeof amenities === "string") {
        try {
          existingYacht.amenities = JSON.parse(amenities);
        } catch (parseError) {
          console.error("Failed to parse amenities JSON:", parseError);
        }
      } else if (Array.isArray(amenities)) {
        existingYacht.amenities = amenities;
      }
    }

    // Boolean conversion
    existingYacht.available =
      available !== undefined ? available === "true" || available === true : existingYacht.available;

    existingYacht.images = imageUrls;

    await existingYacht.save();

    res.json({ success: true, yacht: existingYacht });
  } catch (error) {
    console.error("Error updating yacht:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Delete a yacht
export const deleteYacht = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedYacht = await Yacht.findByIdAndDelete(id);

    if (!deletedYacht) {
      return res.status(404).json({ success: false, message: "Yacht not found" });
    }

    res.json({ success: true, message: "Yacht deleted successfully" });
  } catch (error) {
    console.error("Error deleting yacht:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
