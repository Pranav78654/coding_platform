import express from "express"
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import { createWorkspace, getWorkspace, updateWorkspace, deleteWorkspace } from "../controllers/workspaceController.js";


router.post('/', protect, createWorkspace);
router.get('/:id', protect, getWorkspace);
router.put('/:id', protect, updateWorkspace);
router.delete('/:id', protect, deleteWorkspace);

export default router;
