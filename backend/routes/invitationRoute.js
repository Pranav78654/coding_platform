import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPendingInvitations,
  acceptInvitation,
  declineInvitation,
} from "../controllers/invitationController.js";

const router = express.Router();

// All invitation routes are protected
router.use(protect);

// Get all pending invitations for the current user
router.route("/").get(getPendingInvitations);

// Accept or decline a specific invitation
router.route("/:id/accept").post(acceptInvitation);
router.route("/:id/decline").post(declineInvitation);

export default router;
