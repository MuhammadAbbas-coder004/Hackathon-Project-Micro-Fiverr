const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/services - Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("providerId", "name email location lat long avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
});

// GET /api/services/provider - Get services by the logged-in provider
router.get("/provider", protect, authorize("freelancer"), async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching provider services", error: error.message });
  }
});

// GET /api/services/:id - Get a single service by ID
router.get("/:id", async (req, res) => {
  try {
    const cleanId = req.params.id.trim();
    console.log(`🔍 [Fetching] Service ID: "${cleanId}"`);
    const service = await Service.findById(cleanId).populate("providerId", "name email location lat long avatar balance");
    if (!service) {
      console.log(`❌ [Not Found] Service ID: "${cleanId}"`);
      return res.status(404).json({ message: "Service not found" });
    }
    console.log(`✅ [Found] Service: ${service.title}`);
    res.status(200).json(service);
  } catch (error) {
    console.error(`🔥 [Error] Fetching Service ${req.params.id}:`, error.message);
    res.status(500).json({ message: "Error fetching service detail", error: error.message });
  }
});

// Alias for singular /api/service/:id
router.get("/service/:id", async (req, res) => {
  const cleanId = req.params.id.trim();
  const service = await Service.findById(cleanId).populate("providerId", "name email location lat long avatar balance");
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json(service);
});

// POST /api/services - Create a new service
router.post("/", protect, authorize("freelancer"), async (req, res) => {
  try {
    console.log("📥 [Body] Post Service:", req.body);
    const { title, description, price, category, location, image } = req.body;
    
    // Validate required fields explicitly
    if (!title || !description || !price || !category || !location) {
      return res.status(400).json({ message: "All fields except image are required." });
    }

    const service = await Service.create({
      title,
      description,
      price: Number(price), // Ensure it's a number
      category,
      location,
      image,
      providerId: req.user._id,
    });

    console.log("✅ [Success] Service created:", service._id);
    res.status(201).json(service);
  } catch (error) {
    console.error("❌ [Error] Creating service:", error);
    res.status(500).json({ message: "Error creating service", error: error.message });
  }
});

// GET /api/services/seed - DANGEROUS: Create a demo service if none exist
router.get("/debug/seed", async (req, res) => {
  try {
    // Find any user to be the provider
    const User = require("../models/user");
    const user = await User.findOne();
    if (!user) return res.status(400).json({ message: "No users found in DB. Please register first." });

    const demoService = await Service.create({
      title: "Master Kitchen Cabinet Repair",
      description: "Elite level repair services for all types of kitchen cabinets and fixtures.",
      price: 1500,
      category: "Home Service",
      location: "Lahore, Pakistan",
      providerId: user._id,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000"
    });
    res.json({ message: "Demo Gig Created Successfully!", id: demoService._id });
  } catch (err) {
    res.status(500).json({ message: "Seeding failed", error: err.message });
  }
});

module.exports = router;
