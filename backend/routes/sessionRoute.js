import express from "express"
import {createSession, getSessions, updateSession, deleteSession, getUserSession} from "../controllers/sessionController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createSession);
router.get("/", getSessions);
router.get("/user/session", protect, getUserSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;