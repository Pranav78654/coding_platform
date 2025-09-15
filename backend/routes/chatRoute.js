import express from "express";
import { sendMessage, getMessagesByWorkspace, deleteMessage } from "../controllers/chatController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/:workspaceId/messages", protect, getMessagesByWorkspace);
router.delete("/delete/:messageId", protect, deleteMessage);

export default router;