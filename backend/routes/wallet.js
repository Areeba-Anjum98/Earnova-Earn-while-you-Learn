const express = require("express");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET WALLET */
router.get("/", auth, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user.id });
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* WITHDRAW MONEY */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    wallet.transactions.push({
      type: "withdrawn",
      amount,
      description: "Withdrawal",
      status: "completed",
    });

    await wallet.save();

    res.json({
      message: "Withdrawal successful",
      newBalance: wallet.balance.toFixed(2),
      wallet,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
