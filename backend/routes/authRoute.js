import express from "express";
import {
  registerUser,
  loginUser,
  verifyUser, // import new function
  logoutUser, // import logout function
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // You'll need this middleware

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // Add a logout route

// This is the new protected route to check for a valid cookie
router.get("/verify", protect, verifyUser);

export default router;
