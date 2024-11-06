const express = require('express');
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../controllers/friendController');
const { getPendingRequests,getFriendsList }=require("../controllers/friendController");

const router = express.Router();

// Send Friend Request
router.post('/send', sendFriendRequest);

// Accept Friend Request
router.post('/accept', acceptFriendRequest);

// Reject Friend Request
router.post('/reject', rejectFriendRequest);

//get list of pending requests
router.get('/pending-friends', getPendingRequests);

//get list of friends
router.get('/list-of-friends', getFriendsList);

module.exports = router;