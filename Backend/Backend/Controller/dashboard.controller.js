import { Mansion, Apartment, Jet, Yacht, Concierge } from "../Models/luxary.model.js";
import { BookingModel as Booking} from "../Models/Booking.models.js";
import {ConciergeServiceModel as ConciergeService } from "../Models/ConciergeServices.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Count all documents in each collection
    const [
      mansionCount,
      apartmentCount,
      jetCount,
      yachtCount,
      conciergeCount,
      bookingCount,
      availableMansions,
      availableApartments,
      availableJets,
      availableYachts,
      recentBookings,
    ] = await Promise.all([
      Mansion.countDocuments(),
      Apartment.countDocuments(),
      Jet.countDocuments(),
      Yacht.countDocuments(),
      Concierge.countDocuments(),
      Booking.countDocuments(),
      Mansion.countDocuments({ available: true }),
      Apartment.countDocuments({ available: true }),
      Jet.countDocuments({ available: true }),
      Yacht.countDocuments({ available: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      totalCounts: {
        mansions: mansionCount,
        apartments: apartmentCount,
        jets: jetCount,
        yachts: yachtCount,
        conciergeServices: conciergeCount,
        bookings: bookingCount,
      },
      availableCounts: {
        mansions: availableMansions,
        apartments: availableApartments,
        jets: availableJets,
        yachts: availableYachts,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
