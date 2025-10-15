import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import {
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getUserWorkspaces, // Import the new controller
} from "../controllers/workspaceController.js";

// --- IMPROVED ROUTE STRUCTURE ---

// Route for creating a workspace and getting all of the user's workspaces
router.route("/")
  .post(protect, createWorkspace)
  .get(protect, getUserWorkspaces);

// Routes for a specific workspace by its ID
router.route("/:id")
  .get(protect, getWorkspace)
  .put(protect, updateWorkspace)
  .delete(protect, deleteWorkspace);

export default router;

