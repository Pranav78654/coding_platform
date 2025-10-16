import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import {
  createFileSystemItem,
  getWorkspaceFileTree,
  updateFileSystemItem,
  deleteFileSystemItem,
  getFileSystemItem
} from "../controllers/fileController.js";

// Create a new file or folder
router.post('/', protect, createFileSystemItem);

// Get the entire file tree for a workspace
router.get('/workspace/:workspaceId', protect, getWorkspaceFileTree);
router.get('/:id', protect, getFileSystemItem);

// Update (rename/content) or delete a specific file/folder by its ID
router.route('/:id')
  .put(protect, updateFileSystemItem)
  .delete(protect, deleteFileSystemItem);

export default router;
