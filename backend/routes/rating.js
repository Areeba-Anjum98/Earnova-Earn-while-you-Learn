const express = require("express");
const Rating = require("../models/Rating");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/* CREATE RATING */
router.post("/", auth, async (req, res) => {
  try {
    const { toUserId, rating, comment, sessionId, type } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    const ratingDoc = await Rating.create({
      fromUserId: req.user.id,
      toUserId,
      rating,
      comment,
      sessionId,
      type,
    });

    // ✅ Update user's average rating
    const ratings = await Rating.find({ toUserId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await User.findByIdAndUpdate(toUserId, {
      avgRating: parseFloat(avgRating.toFixed(2)),
      totalRatings: ratings.length,
    });

    res.json(ratingDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET USER RATINGS */
router.get("/user/:userId", async (req, res) => {
  try {
    const ratings = await Rating.find({ toUserId: req.params.userId }).populate(
      "fromUserId",
      "name avatar",
    );

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
