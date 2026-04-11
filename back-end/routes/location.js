const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get nearby online freelancers
// @route   GET /api/location/nearby
// @access  Private
router.get("/nearby", protect, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km

    if (!lat || !lng) {
      return res.status(400).json({ message: "Coordinates are required" });
    }

    // Simple distance filtering (Production would use MongoDB $near or $geoWithin)
    const allFreelancers = await User.find({ 
      role: "freelancer", 
      isOnline: true 
    }).select("name avatar rating lat long location bio");

    const nearby = allFreelancers.filter(f => {
      const dist = getDistanceFromLatLonInKm(lat, lng, f.lat, f.long);
      return dist <= radius;
    });

    res.json(nearby);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router;
