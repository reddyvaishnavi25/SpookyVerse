const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const test = (req, res) => {
  res.json("test is working");
};
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({
        error: "email is taken already",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Assuming you've already hashed the password
      listOfFriends: [], // Empty initially
      pendingRequests: [], // Empty initially
      status: "offline", // Default status
    });
    await newUser.save();
    return res.status(200).json({ message: "Successful registration" });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" }); // User not found
    }

    // Check if the password matches
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" }); // Incorrect password
    }
    const token = jwt.sign(
      { email: user.email, name: user.firstName, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Set token in an HTTP-only cookie
    return res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "None",
        secure: process.env.NODE_ENV === "production", // Use secure in production
      })
      .json({
        message: "Login successful",
        user: { email: user.email, name: user.firstName },
      });
    // If login is successful, return the user (omit password for security)
    const { password: pwd, ...userData } = user._doc; // Exclude password from response
    return res.status(200).json(userData); // Return user data
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { test, registerUser, loginUser };
