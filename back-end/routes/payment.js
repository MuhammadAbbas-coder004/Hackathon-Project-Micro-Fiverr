const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");

// @desc    Process fake payment
// @route   POST /api/payment/fake-payment
// @access  Private
router.post("/fake-payment", protect, async (req, res) => {
  try {
    const { freelancerId, serviceId, amount } = req.body;
    const clientId = req.user._id;

    console.log("💳 Payment Request:", { freelancerId, serviceId, amount, clientId });

    if (!freelancerId || !amount || !serviceId) {
      return res.status(400).json({ 
        message: "Missing payment details", 
        received: { freelancerId, serviceId, amount } 
      });
    }

    // Ensure freelancer exists
    const freelancer = await User.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    // 1. Create Transaction record
    const transaction = await Transaction.create({
      clientId,
      freelancerId,
      serviceId,
      amount: Number(amount),
      clientName: req.user.name,
      status: "paid",
      isConfirmed: false
    });

    // 2. Update Freelancer's balance
    freelancer.balance = (freelancer.balance || 0) + Number(amount);
    await freelancer.save();
      
    // 3. Notify freelancer via Socket.io
    const io = req.app.get("socketio");
    if (io) {
      io.to(freelancerId.toString()).emit("payment_received", {
        amount,
        clientName: req.user.name,
        transactionId: transaction._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Payment successful (Demo Mode)",
      transaction,
    });
  } catch (err) {
    console.error("❌ Payment Error:", err);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
});

// @desc    Freelancer confirms payment receipt
// @route   PATCH /api/payment/confirm/:id
router.patch("/confirm/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    
    if (transaction.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    transaction.isConfirmed = true;
    await transaction.save();

    res.json({ success: true, message: "Payment confirmed by freelancer" });
  } catch (err) {
    res.status(500).json({ message: "Error confirming payment" });
  }
});

// @desc    Get transaction history
// @route   GET /api/payment/history
router.get("/history", protect, async (req, res) => {
  try {
    const query = req.user.role === 'freelancer' 
      ? { freelancerId: req.user._id } 
      : { clientId: req.user._id };

    const history = await Transaction.find(query)
      .populate("serviceId", "title")
      .populate("clientId", "name")
      .populate("freelancerId", "name")
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
});

module.exports = router;
