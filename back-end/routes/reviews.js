const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const { protect } = require("../middleware/authMiddleware");

// POST /api/reviews - Leave a review
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, jobId, rating, comment } = req.body;
    console.log(`📝 Attempting to save review for receiver: ${receiverId}`);
    
    // 1. Create the review
    const review = await Review.create({
      reviewer: req.user._id,
      receiver: receiverId,
      job: jobId,
      rating: Number(rating),
      comment,
    });

    // 2. Update Freelancer's average rating and review count
    const User = require("../models/user");
    const reviews = await Review.find({ receiver: receiverId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await User.findByIdAndUpdate(receiverId, { 
      rating: avgRating.toFixed(1),
      reviewCount: reviews.length
    });

    console.log(`⭐ [Success] New Rating for ${receiverId}: ${avgRating.toFixed(1)} (Total Reviews: ${reviews.length})`);

    res.status(201).json(review);
  } catch (error) {
    console.error("❌ Error leaving review:", error.message);
    res.status(500).json({ message: "Error leaving review", error: error.message });
  }
});

// GET /api/reviews/:userId - Get reviews for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`🔍 Fetching reviews for User ID: ${userId}`);
    const reviews = await Review.find({ receiver: userId })
      .populate("reviewer", "name avatar")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${reviews.length} reviews for user ${userId}`);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error.message);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

module.exports = router;
