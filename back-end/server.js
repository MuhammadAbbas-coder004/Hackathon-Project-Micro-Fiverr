const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Explicitly allow Vite and React default ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ==================== SOCKET.IO SETUP ====================
io.on("connection", (socket) => {
  console.log(`🔌 Socket Connected: ${socket.id}`);

  // User joins their personal room based on their MongoDB User ID
  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  // JOIN TRACKING ROOM: For a specific booking
  socket.on("join_tracking", (bookingId) => {
    socket.join(`tracking_${bookingId}`);
    console.log(`📍 User joined tracking room: ${bookingId}`);
  });

  // FREELANCER ONLINE STATUS
  socket.on("set_online", async ({ userId, isOnline }) => {
    try {
      const User = require("./models/user");
      await User.findByIdAndUpdate(userId, { isOnline });
      console.log(`📡 User ${userId} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      // Join their room to receiving tracking requests
      if (isOnline) socket.join(`requests_${userId}`);
    } catch (err) {
      console.error("Error setting online status:", err);
    }
  });

  // CLIENT REQUESTS TO SHARE LOCATION
  socket.on("share_request", (data) => {
    // data: { clientId, clientName, freelancerId, bookingId }
    console.log(`📩 Location share request from ${data.clientName} to ${data.freelancerId}`);
    io.to(`requests_${data.freelancerId}`).emit("incoming_share_request", data);
  });

  // FREELANCER ACCEPTS REQUEST
  socket.on("accept_share", (data) => {
    // data: { clientId, bookingId }
    console.log(`✅ Freelancer accepted share for booking: ${data.bookingId}`);
    io.to(data.clientId).emit("share_accepted", data);
  });

  // CLIENT UPDATES LOCATION (Sent to Freelancer)
  socket.on("client_update_location", (data) => {
    // data: { bookingId, lat, lng }
    io.to(`tracking_${data.bookingId}`).emit("client_location_received", data);
  });

  // UPDATE LOCATION: Sent by Freelancer (Existing)
  socket.on("update_location", async (data) => {
    // data: { bookingId, freelancerId, lat, lng }
    console.log("📍 Location Update Received:", data);
    
    // Broadcast to everyone tracking this booking
    io.to(`tracking_${data.bookingId}`).emit("location_received", {
      lat: data.lat,
      lng: data.lng,
      freelancerId: data.freelancerId,
      updatedAt: new Date()
    });

    // Optionally: Update user's location in Database periodically
    // (Optimization: Only do this every few minutes or if distance moved is significant)
    try {
      const User = require("./models/user");
      await User.findByIdAndUpdate(data.freelancerId, {
        lat: data.lat,
        long: data.lng
      });
    } catch (err) {
      console.error("Error updating user location in DB:", err);
    }
  });

  // Handle incoming messages
  socket.on("send_message", (data) => {
    console.log("💬 Message sent via Socket:", data);
    if (data.receiverId) {
      io.to(data.receiverId).emit("receive_message", data);
    }
  });

  // Handle read receipts
  socket.on("mark_read", ({ senderId, readerId }) => {
    if (senderId) {
      io.to(senderId).emit("messages_read", { readerId });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket Disconnected: ${socket.id}`);
  });
});

// ==================== MIDDLEWARE ====================
// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow Vite and CRA
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// express.json() allows your app to parse JSON data sent from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging with status codes
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`📡 [Incoming] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    const bodyCopy = { ...(req.body || {}) };
    if (bodyCopy.password) bodyCopy.password = '***';
    console.log(`📦 Body [${req.method} ${req.url}]:`, bodyCopy);
  }
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusColor} [Finished] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ==================== ROUTES ====================
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/services", require("./routes/services"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/location", require("./routes/location"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/admin", require("./routes/admin"));

// Inject socketio into app for routes
app.set("socketio", io);

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Micro Fiverr API is running ok bro!" });
});

// ==================== CATCH ALL 404 (JSON) ====================
app.use((req, res) => {
  res.status(404).json({ message: "⚠️ Route not found. Check your API URL." });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(500).json({ message: "🔥 Something went wrong on the server!" });
});

// ==================== SERVER & DATABASE ====================
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI is not defined in .env file!");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not defined. Authentication will fail!");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("⏳ Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected! Waiting for Mongoose to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected successfully!");
});

// ==================== ERROR HANDLING (GLOBAL) ====================
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Start the Server unconditionally to ensure APIs remain reachable
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Use the Health Check: http://localhost:${PORT}/`);
  console.log(`💡 Note: If you see 502 error, make sure ONLY ONE terminal is running the backend.`);
});

// Connect to Database
connectDB();

module.exports = app;
