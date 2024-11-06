const mongoose=require('mongoose')
const {Schema}=mongoose

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Array of ObjectId references to other users (list of friends)
  listOfFriends: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
      name: {
        type: String,  // Full name of the friend
        required: true,
      },
      status: {
        type: String,
        enum: ["online", "offline", "busy", "away"], // Example statuses
        default: "offline", // Default status
      },
      lastMessage: {
        type: String,
        default: "", // No message initially
      },
      addedAt: {
        type: Date,
        default: Date.now, // Timestamp when the friend was added
      }
    }
  ],
  // Array of ObjectId references for pending requests
  pendingRequests: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
      name: {
        type: String,  // Full name of the user sending the request
        required: true,
      },
      status: {
        type: String,
        default: "pending", // Status of the request (always pending initially)
      },
      requestedAt: {
        type: Date,
        default: Date.now, // Timestamp when the request was sent
      }
    }
  ],
  // Optional: You can define the user's online status or visibility
  status: {
    type: String,
    enum: ["online", "offline", "busy", "away"], // Example statuses
    default: "offline", // Default status
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

  const User = mongoose.model("User", userSchema);
  module.exports = User;