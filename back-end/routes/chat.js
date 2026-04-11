const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { protect } = require("../middleware/authMiddleware");

// GET /api/chat/conversations - Get list of conversations
router.get("/conversations", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver
          : msg.sender;

      if (!conversationsMap.has(otherUser._id.toString())) {
        conversationsMap.set(otherUser._id.toString(), {
          id: otherUser._id,
          name: otherUser.name,
          lastMsg: msg.message,
          time: msg.createdAt,
          unread: 0,
          online: true 
        });
      }
    });

    res.status(200).json(Array.from(conversationsMap.values()));
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
});

// GET /api/chat/:userId - Get all messages with a specific user
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
});

// POST /api/chat - Send a message
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
});

// PUT /api/chat/:userId/read - Mark messages as read
router.put("/:userId/read", protect, async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating read status", error: error.message });
  }
});

module.exports = router;
