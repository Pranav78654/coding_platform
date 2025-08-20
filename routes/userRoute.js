import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import {protect, isTA} from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, isTA, getAllUsers)
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;