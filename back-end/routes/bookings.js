const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/bookings/user/active - Get all active bookings for the logged-in client
router.get("/user/active", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id, status: { $in: ["Active", "Paid"] } })
      .populate("providerId", "name avatar location lat long")
      .populate("serviceId", "title price")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
});

// GET /api/bookings/provider - Get all bookings for the logged-in provider
router.get("/provider", protect, authorize("freelancer"), async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id })
      .populate("customerId", "name avatar location lat long")
      .populate("serviceId", "title price")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching provider bookings", error: error.message });
  }
});

// GET /api/bookings/provider/stats - Get earnings statistics for a provider
router.get("/provider/stats", protect, authorize("freelancer"), async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id })
      .populate("serviceId", "title price");
    
    const totalEarned = bookings
      .filter(b => b.status === "completed" || b.status === "Completed")
      .reduce((sum, b) => sum + (b.totalPrice || (b.serviceId?.price || 0)), 0);
      
    const pending = bookings
      .filter(b => ["Pending", "Active", "Paid"].includes(b.status))
      .reduce((sum, b) => sum + (b.totalPrice || (b.serviceId?.price || 0)), 0);

    const balance = req.user.balance || (totalEarned * 0.8); // Simple 80/20 split mock if balance not in user

    const recentTransactions = bookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(b => ({
        id: b._id,
        type: "payment",
        amount: b.totalPrice || (b.serviceId?.price || 0),
        date: b.createdAt,
        status: b.status,
        note: `Payment for Order #${b._id.toString().slice(-6)}`
      }));

    res.json({
      balance,
      totalEarned,
      pending,
      recentTransactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/bookings/:id - Get booking details with provider and customer locations
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("providerId", "name avatar lat long phone")
      .populate("customerId", "name lat long")
      .populate("serviceId", "title price");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
});

module.exports = router;

