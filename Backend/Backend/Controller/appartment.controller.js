import { uploadToCloudinary } from "../Config/cloudenary.config.js";
import { Apartment } from "../Models/luxary.model.js";

//! Get all apartments
export const getAllApartments = async (req, res) => {
  try {
    const allApartments = await Apartment.find();

    res.json({ success: true, allApartments });
  } catch (error) {
    // Log the error and send a 500 status code if something goes wrong
    console.error("Error fetching apartments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//! Get apartment by ID
export const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    //! Find the apartment by its ID using Mongoose's findById method
    const apartment = await Apartment.findById(id);

    if (!apartment) {
      res.status(404).json({ success: false, message: "Apartment not found" });
      return;
    }

    //! Return the apartment as a JSON response
    res.json({ success: true, apartment });
  } catch (error) {
    //! Log and return a server error if there's an issue
    console.error("Error fetching apartment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//! Create a new apartment
export const createApartment = async (req, res) => {
  try {
    const { title, description, price, location, amenities, available } =
      req.body;

    //! Handle file uploads
    const files = req.files;
    console.log("files:---", files);

    let imageUrls = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    // !Parse amenities if it's a string (from form-data)
    const parsedAmenities =
      typeof amenities === "string" ? JSON.parse(amenities) : amenities;

    //! Create and save new apartment document
    const newApartment = new Apartment({
      title,
      description,
      price: parseInt(price),
      location,
      amenities: parsedAmenities,
      images: imageUrls,
      available: available === "true" || available === true,
    });

    await newApartment.save();

    res.status(201).json({ success: true, apartment: newApartment });
  } catch (error) {
    console.error("Error creating apartment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//! Update mansion
export const updateAppartments = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, amenities, available } =
      req.body;

    const existingAppartments = await Apartment.findById(id);

    if (!existingAppartments) {
      res.status(404).json({ success: false, message: "Appartment not found" });
      return;
    }

    const files = req.files;
    let imageUrls = existingAppartments.images;

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => uploadToCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
      const newImageUrls = uploadResults.map((result) => result.secure_url);
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    const parsedAmenities =
      typeof amenities === "string" ? JSON.parse(amenities) : amenities;

    existingAppartments.title = title || existingAppartments.title;
    existingAppartments.description =
      description || existingAppartments.description;
    existingAppartments.price = price
      ? parseInt(price)
      : existingAppartments.price;
    existingAppartments.location = location || existingAppartments.location;
    existingAppartments.amenities =
      parsedAmenities || existingAppartments.amenities;
    existingAppartments.images = imageUrls;
    existingAppartments.available =
      available !== undefined
        ? available === "true" || available === true
        : existingAppartments.available;

    await existingAppartments.save();
    res.json({ success: true, mansion: existingAppartments });
  } catch (error) {
    console.error("Error updating Appartments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ! delete appartments
//! Delete a jet
export const deleteAppartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppaartment = await Apartment.findByIdAndDelete(id);

    if (!deletedAppaartment) {
      return res
        .status(404)
        .json({ success: false, message: "appartment not found" });
    }

    res.json({ success: true, message: "appartment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appartment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
