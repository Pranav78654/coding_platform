import Invitation from "../models/invitationModel.js";
import Workspace from "../models/workspaceModel.js";
import User from "../models/userModel.js";

/**
 * @desc    Get all pending invitations for the logged-in user
 * @route   GET /api/invitations
 * @access  Private
 */
export const getPendingInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      invitee: req.user._id,
      status: "pending",
    })
      .populate("workspace", "name") // Get the name of the workspace
      .populate("inviter", "username email"); // Get the inviter's details

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Accept a workspace invitation
 * @route   POST /api/invitations/:id/accept
 * @access  Private
 */
export const acceptInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Ensure the person accepting is the one who was invited
    if (invitation.invitee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to accept this invitation" });
    }
    
    // Check if invitation is still pending
    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: `Invitation has already been ${invitation.status}` });
    }

    // 1. Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    // 2. Add user to the workspace's participants list
    await Workspace.findByIdAndUpdate(invitation.workspace, {
      $addToSet: { participants: req.user._id }, // use $addToSet to avoid duplicates
    });

    // 3. Add workspace to the user's workspaces list
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { workspaces: invitation.workspace },
    });

    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Decline a workspace invitation
 * @route   POST /api/invitations/:id/decline
 * @access  Private
 */
export const declineInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Ensure the person declining is the one who was invited
    if (invitation.invitee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to decline this invitation" });
    }
    
    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: `Invitation has already been ${invitation.status}` });
    }

    // Simply update the status. You could also delete it if you prefer.
    invitation.status = "declined";
    await invitation.save();

    res.status(200).json({ message: "Invitation declined" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
