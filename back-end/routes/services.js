const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/services - Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("providerId", "name email location lat long avatar rating reviewCount")
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
    
    const today = new Date().toISOString().split('T')[0];
    const service = await Service.findById(cleanId);
    
    if (service) {
      service.views += 1;
      const hIdx = service.viewHistory.findIndex(h => h.date === today);
      if (hIdx > -1) service.viewHistory[hIdx].count += 1;
      else service.viewHistory.push({ date: today, count: 1 });
      await service.save();
      const populated = await Service.findById(cleanId).populate("providerId", "name email location lat long avatar balance rating reviewCount");
      return res.status(200).json(populated);
    }
    return res.status(404).json({ message: "Service not found" });
  } catch (error) {
    console.error(`🔥 [Error] Fetching Service ${req.params.id}:`, error.message);
    res.status(500).json({ message: "Error fetching service detail", error: error.message });
  }
});

// Alias for singular /api/service/:id
router.get("/service/:id", async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const service = await Service.findById(cleanId);
  if (service) {
    service.views += 1;
    const hIdx = service.viewHistory.findIndex(h => h.date === today);
    if (hIdx > -1) service.viewHistory[hIdx].count += 1;
    else service.viewHistory.push({ date: today, count: 1 });
    await service.save();
    const populated = await Service.findById(cleanId).populate("providerId", "name email location lat long avatar balance rating reviewCount");
    return res.json(populated);
  }
  return res.status(404).json({ message: "Service not found" });
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
