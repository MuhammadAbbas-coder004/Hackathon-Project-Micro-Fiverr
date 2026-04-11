const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const { protect } = require("../middleware/authMiddleware");

// POST /api/reviews - Leave a review
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, jobId, rating, comment } = req.body;
    const review = await Review.create({
      reviewer: req.user._id,
      receiver: receiverId,
      job: jobId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error leaving review", error: error.message });
  }
});

// GET /api/reviews/:userId - Get reviews for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ receiver: req.params.userId })
      .populate("reviewer", "name avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

module.exports = router;
