import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// This function can stay the same.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// A helper function to set the cookie. This avoids repetition.
const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email: emailLower,
      password,
    });
    
    // Generate token and set it in the cookie
    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    // Send response WITHOUT the token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    // Send response WITHOUT the token
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// @desc Verify user session from cookie
// NEW function to check if the user has a valid session
export const verifyUser = async (req, res) => {
  // authMiddleware will run before this. If the token is valid, 
  // it will attach the user object (minus password) to req.user.
  res.status(200).json({
    message: "User is authenticated",
    user: req.user 
  });
};

// @desc Logout user
export const logoutUser = (req, res) => {
    // Clear the cookie by setting an expired one
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
};
