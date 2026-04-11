const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Plumbing", "Electrical", "Tutoring", "Cleaning", "Painting", "Other", "Repairing", "Home Service", "Technical", "Education", "Events", "Design", "Commercial"],
      default: "Other",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "", // For future Cloudinary integration
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
