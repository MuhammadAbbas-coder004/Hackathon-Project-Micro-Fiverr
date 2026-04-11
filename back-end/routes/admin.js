const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Review = require("../models/review");
const { protect, authorize } = require("../middleware/authMiddleware");

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================
router.use(protect);
router.use(authorize("admin"));

// 1. Get all users (Clients & Freelancers)
router.get("/users", async (req, res) => {
  try {
    // Exclude admins to prevent accidental bans of other admins
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// 2. Toggle Ban Status for a User
router.put("/users/:id/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Prevent banning other admins
    if (user.role === "admin") {
       return res.status(403).json({ message: "Cannot ban an administrator." });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({ 
        message: user.isBanned ? "User account has been banned." : "User ban has been lifted.",
        user: { _id: user._id, isBanned: user.isBanned }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating ban status", error: error.message });
  }
});

// 3. Get all reviews (for moderation)
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

// 4. Delete a spam review
router.delete("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.status(200).json({ message: "Spam review removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
});

module.exports = router;
