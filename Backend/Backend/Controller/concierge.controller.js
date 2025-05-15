import { uploadToCloudinary } from "../Config/cloudenary.config.js";
import { ConciergeServiceModel } from "../Models/ConciergeServices.model.js";
import { Concierge } from "../Models/luxary.model.js";

//! Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Concierge.find();
    res.json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Concierge.findById(id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Create a new service
export const createService = async (req, res) => {
  try {
    const { title, description, price, location, amenities, available } =
      req.body;

    // Validate input
    if (!title || !description || !price || !location || !amenities) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const files = req.files;
    let imageUrls = [];

    // Validate if files are provided and check for valid image formats
    if (files && files.length > 0) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const invalidFiles = files.filter(
        (file) => !validImageTypes.includes(file.mimetype)
      );

      if (invalidFiles.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid file type(s)" });
      }

      // Upload to Cloudinary
      const uploadPromises = files.map((file) => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    // Parse amenities if it's a string (could be JSON encoded)
    const parsedAmenities =
      typeof amenities === "string" ? JSON.parse(amenities) : amenities;

    // Create new Concierge object
    const newConcierge = new Concierge({
      title,
      description,
      price: parseInt(price), // Ensure price is an integer
      location,
      amenities: parsedAmenities,
      images: imageUrls,
      available: available === "true" || available === true,
    });

    // Save new concierge
    await newConcierge.save();

    // Return success response
    res.status(201).json({ success: true, concierge: newConcierge });
  } catch (error) {
    console.error("Error creating Concierge:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! Update a service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const existingConcierge = await Concierge.findById(id);

    if (!existingConcierge) {
      return res.status(404).json({ success: false, message: "Jet not found" });
    }

    const { title, description, price, location, amenities, available } =
      req.body;

    let imageUrls = existingConcierge.images || [];

    // Handle file uploads if they exist
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.path)
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    // Update fields with default or incoming values
    existingConcierge.title = title || existingConcierge.title;
    existingConcierge.description =
      description || existingConcierge.description;
    existingConcierge.price = price ? parseInt(price) : existingConcierge.price;
    existingConcierge.location = location || existingConcierge.location;

    // Handle amenities parsing: ensure it's a valid JSON string
    if (amenities) {
      try {
        // Check if amenities is a string, and only parse if it is
        existingConcierge.amenities =
          typeof amenities === "string" ? JSON.parse(amenities) : amenities;
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid amenities format" });
      }
    }

    existingConcierge.available =
      available !== undefined
        ? available === "true" || available === true
        : existingConcierge.available;
    existingConcierge.images = imageUrls;

    await existingConcierge.save();

    return res.json({ success: true, concierge: existingConcierge });
  } catch (error) {
    console.error("Error updating jet:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error, please try again later",
      });
  }
};

//! Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Concierge.findByIdAndDelete(id);

    if (!deletedService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
