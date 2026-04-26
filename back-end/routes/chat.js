const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

// GET /api/chat/users/search - Search for users to start new chat
router.get("/users/search", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude self
        {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } }
          ]
        }
      ]
    }).select("name email avatar isOnline").limit(10);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error: error.message });
  }
});

// GET /api/chat/conversations - Get list of conversations
router.get("/conversations", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
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
          avatar: otherUser.avatar,
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
    const { receiverId, message, type } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
      type: type || "text",
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
// DELETE /api/chat/:userId/clear - Clear chat history with a specific user
router.delete("/:userId/clear", protect, async (req, res) => {
  try {
    await Message.deleteMany({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    });
    res.status(200).json({ success: true, message: "Chat cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing chat", error: error.message });
  }
});
// DELETE /api/chat/all/clear - Clear ALL chats for the user
router.delete("/all/clear", protect, async (req, res) => {
  try {
    await Message.deleteMany({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    });
    res.status(200).json({ success: true, message: "All chats cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing all chats", error: error.message });
  }
});

// DELETE /api/chat/message/:msgId - Delete a specific message
router.delete("/message/:msgId", protect, async (req, res) => {
  try {
    await Message.findOneAndDelete({
      _id: req.params.msgId,
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    });
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error: error.message });
  }
});

module.exports = router;
