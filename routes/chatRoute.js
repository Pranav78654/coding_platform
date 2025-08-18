import express from "express";
import { sendMessage, getMessagesByWorkspace, deleteMessage } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/:workspaceId/messages", authMiddleware, getMessagesByWorkspace);
router.delete("/delete/:messageId", authMiddleware, deleteMessage);

export default router;