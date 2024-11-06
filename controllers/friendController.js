const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token
  console.log(token);
  if (!token) return null;

  try {
    // Get the secret from the environment variable
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      console.error("Secret key is missing.");
      return null;
    }

    // Use the secret key here
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded Token: ", decoded);

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
    console.log(senderId);
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

    // Get sender's full name
    const sender = await User.findById(senderId);

    // Add the sender to the recipient's pending requests with additional details
    recipient.pendingRequests.push({
      userId: senderId,
      name: `${sender.firstName} ${sender.lastName}`,
      status: "pending", // Always set status as "pending"
      requestedAt: new Date(),
    });

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
  const userId = getUserIdFromToken(req);
  const { friendId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Fetch both user and friend details
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found." });
    }

    // Remove the pending request from both users
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingRequests: { userId: friendId } },
        $addToSet: {
          listOfFriends: {
            userId: friendId,
            name: `${friend.firstName} ${friend.lastName}`,
            status: "online", // Friend's status upon accepting request
            lastMessage: "", // Initial empty message (can be updated later)
          },
        },
      },
      { new: true }
    );

    const updatedFriend = await User.findByIdAndUpdate(
      friendId,
      {
        $addToSet: {
          listOfFriends: {
            userId: userId,
            name: `${user.firstName} ${user.lastName}`,
            status: "online", // Your status upon accepting request
            lastMessage: "", // Initial empty message (can be updated later)
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Friend request accepted!",
      user: updatedUser,
      friend: updatedFriend,
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Reject Friend Request
const rejectFriendRequest = async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { friendId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

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
