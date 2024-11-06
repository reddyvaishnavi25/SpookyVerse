const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Middleware to extract user ID from JWT
const getUserIdFromToken = (req) => {
  const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY"); // Replace with your actual secret
    return decoded.id; // Assuming your token contains the user ID in `id`
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Send Friend Request
const sendFriendRequest = async (req, res) => {
  const recipientId = req.body.recipientId; // Get recipient ID from request body
  const senderId = getUserIdFromToken(req); // Get sender ID from token

  if (!senderId) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Prevent user from sending friend request to themselves
  if (senderId === recipientId) {
    return res
      .status(400)
      .json({ message: "Cannot send a friend request to yourself" });
  }

  try {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if the friend request has already been sent
    const alreadyRequested = recipient.pendingRequests.some(
      (request) => request.userId.toString() === senderId
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Add the sender to the recipient's pending requests
    recipient.pendingRequests.push({ userId: senderId });

    // Save the updated recipient (with the pending request)
    const updatedRecipient = await recipient.save();

    res.status(200).json({
      message: "Friend request sent successfully",
      recipient: updatedRecipient, // Return updated recipient data
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Accept Friend Request
const acceptFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingRequests: { userId: friendId } },
        $addToSet: { listOfFriends: { userId: friendId } },
      },
      { new: true }
    );

    const friend = await User.findByIdAndUpdate(
      friendId,
      { $addToSet: { listOfFriends: { userId } } },
      { new: true }
    );

    if (user && friend) {
      res
        .status(200)
        .json({ message: "Friend request accepted!", user, friend });
    } else {
      res.status(404).json({ message: "User or friend not found." });
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Reject Friend Request
const rejectFriendRequest = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingRequests: { userId: friendId } },
      },
      { new: true }
    );

    if (user) {
      res.status(200).json({ message: "Friend request rejected" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
