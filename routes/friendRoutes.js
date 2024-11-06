<<<<<<< HEAD
const express = require("express");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/friendController");
=======
const express = require('express');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../controllers/friendController');
>>>>>>> origin/vaishnavi_BE

const router = express.Router();

// Send Friend Request
<<<<<<< HEAD
router.post("/send", sendFriendRequest);

// Accept Friend Request
router.post("/accept", acceptFriendRequest);

// Reject Friend Request
router.post("/reject", rejectFriendRequest);

module.exports = router;
=======
router.post('/send', sendFriendRequest);

// Accept Friend Request
router.post('/accept', acceptFriendRequest);

// Reject Friend Request
router.post('/reject', rejectFriendRequest);

module.exports = router;
>>>>>>> origin/vaishnavi_BE
