import express from "express";
import { createReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/", getReviews);
router.delete("/:id", protect, deleteReview);

export default router;
