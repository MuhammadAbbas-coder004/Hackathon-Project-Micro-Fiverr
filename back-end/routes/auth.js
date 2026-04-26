const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Message = require("../models/message");
const Booking = require("../models/booking");
const Job = require("../models/job");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// POST /api/auth/register
router.post("/register", async (req, res) => {
  console.log("📝 Registration attempt received for email:", req.body?.email);
  
  // Check if database is connected
  if (User.db.readyState !== 1) {
    console.error("❌ Registration failed: Database not connected. State:", User.db.readyState);
    return res.status(503).json({ 
      message: "Database is not connected. Please try again in 10 seconds or check server logs if the problem persists." 
    });
  }

  try {
    const { name, email, password, role, location } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).maxTimeMS(5000); 
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Create new user (password is hashed automatically via pre-save hook)
    console.log("⏳ Saving user to database...");
    const savedUser = await User.create({
      name,
      email,
      password,
      role: role || "client",
      location: location || "",
    });

    console.log("✅ User saved successfully:", savedUser?._id);

    // Generate token
    const token = generateToken(savedUser._id);

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Register error detailed:", error);
    
    // Check for specific mongoose errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }

    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(503).json({ message: "Database connection timeout. Please ensure your IP is whitelisted in MongoDB Atlas." });
    }

    res.status(500).json({ 
      message: "Server error during registration.",
      details: error.message 
    });
  }
});


// POST /api/auth/login
router.post("/login", async (req, res) => {
  // Check if database is connected
  if (User.db.readyState !== 1) {
    console.error("❌ Login failed: Database not connected. State:", User.db.readyState);
    return res.status(503).json({ 
      message: "Database is not connected. Login is currently unavailable." 
    });
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Account Blocked: Your account has been permanently banned by an administrator." });
    }

    // Compare password using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate token
    const token = generateToken(user._id);

    // Prepare user response (full data except password)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful!",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/auth/me (Protected Route)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isBanned) {
      return res.status(403).json({ message: "Account Blocked: Your account has been permanently banned." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/auth/user/:id - Get basic user profile by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email avatar role bio rating location lat long")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error." });
  }
});


// PUT /api/auth/profile (Protected Route)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, avatar, coverImage, phone, bio, skills, location } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (coverImage !== undefined) user.coverImage = coverImage;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    if (location !== undefined) user.location = location;
    if (req.body.lat !== undefined) user.lat = req.body.lat;
    if (req.body.long !== undefined) user.long = req.body.long;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        skills: user.skills,
        location: user.location
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error during profile update." });
  }
});

// GET /api/auth/notifications/count (Protected Route)
router.get("/notifications/count", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Unread Messages
    const unreadMessages = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    // 2. Pending Bookings (Applications/Proposals for Freelancer)
    const pendingBookings = await Booking.countDocuments({
      providerId: userId,
      status: "Pending"
    });

    res.status(200).json({
      chat: unreadMessages,
      proposals: pendingBookings,
      total: unreadMessages + pendingBookings
    });
  } catch (error) {
    console.error("Notifications count error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
