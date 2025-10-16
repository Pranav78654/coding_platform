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


export const createInvitation = async (req, res) => {
  const { workspaceId, inviteeEmail } = req.body;
  const inviterId = req.user._id;

  try {
    // 1. Find the user to invite
    const invitee = await User.findOne({ email: inviteeEmail });
    if (!invitee) {
      return res.status(404).json({ message: "User with that email not found." });
    }

    // 2. Find the workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    // 3. Prevent self-invitation
    if (invitee._id.toString() === inviterId.toString()) {
        return res.status(400).json({ message: "You cannot invite yourself." });
    }

    // 4. Check if the user is already a participant
    if (workspace.participants.includes(invitee._id)) {
      return res.status(400).json({ message: "User is already a member of this workspace." });
    }

    // 5. Check if an invitation is already pending
    const existingInvitation = await Invitation.findOne({
      workspace: workspaceId,
      inviteeEmail: inviteeEmail,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(400).json({ message: "An invitation has already been sent to this user." });
    }

    // 6. Create the invitation
    const newInvitation = await Invitation.create({
      workspace: workspaceId,
      inviter: inviterId,
      invitee: invitee._id, // Add this line
      inviteeEmail: inviteeEmail,
    });
    
    // --- REAL-TIME MAGIC ---
const io = req.app.get("io");
const populatedInvitation = await newInvitation.populate([
    { path: 'workspace', select: 'name' },
    { path: 'inviter', select: 'username' }
]);

// Emit event to the specific user being invited
io.to(invitee._id.toString()).emit("new-invitation", populatedInvitation);



    res.status(201).json({ message: "Invitation sent successfully.", invitation: newInvitation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};