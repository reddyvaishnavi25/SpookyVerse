const express = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/friendController");

const router = express.Router();

// Send Friend Request
router.post("/send", sendFriendRequest);

// Accept Friend Request
router.post("/accept", acceptFriendRequest);

// Reject Friend Request
router.post("/reject", rejectFriendRequest);

module.exports = router;
