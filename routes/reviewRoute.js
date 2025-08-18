import express from "express";
import { createReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/", getReviews);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
