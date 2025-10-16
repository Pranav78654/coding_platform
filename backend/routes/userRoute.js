import express from "express";
import { protect, isTA } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
} from "../controllers/userController.js";

const router = express.Router();
router.route("/search").get(protect, searchUsers);
// Route to get all users, protected and restricted to 'ta' role
router.route("/").get(protect, isTA, getAllUsers);

// Routes for a specific user by their ID
router
  .route("/:id")
  .get(protect, getUserById) // Protected, controller handles self-access or 'ta'
  .put(protect, updateUser) // Protected, controller handles self-update or 'ta'
  .delete(protect, deleteUser); // Protected, controller handles self-delete or 'ta'

export default router;
