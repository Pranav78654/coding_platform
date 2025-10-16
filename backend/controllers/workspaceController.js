import Workspace from "../models/workspaceModel.js";
import User from "../models/userModel.js";
import File from "../models/fileModel.js"; // 1. Import the File model
import Chat from "../models/chatModel.js"; // 1. Import the Chat model
import mongoose from "mongoose";

// Get all workspaces for the logged-in user
export const getUserWorkspaces = async (req, res) => {
  try {
    // Find all workspaces where the current user is a participant
    const workspaces = await Workspace.find({ participants: req.user._id })
      .populate('owner', 'username email _id') // Crucial: Populate the owner field with these details
      .populate('participants', 'username email') // Also good to populate participants
      .sort({ updatedAt: -1 }); // Sort by the most recently updated

    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required." });
    }

    const newWorkspace = new Workspace({
      name,
      owner: ownerId,
      participants: [ownerId], // The owner is the first participant
    });

    await newWorkspace.save();

    // Also update the User document to include this new workspace
    await User.findByIdAndUpdate(ownerId, { $push: { workspaces: newWorkspace._id } });
    
    // Populate the owner details before sending the response back
    const populatedWorkspace = await Workspace.findById(newWorkspace._id)
        .populate('owner', 'username email _id');

    return res.status(201).json(populatedWorkspace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single workspace
export const getWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const workspace = await Workspace.findById(workspaceId)
      .populate("owner", "username email")
      .populate("participants", "username email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.json(workspace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update workspace (only owner)
export const updateWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const updates = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Only owner can update
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(workspace, updates);
    await workspace.save();

    return res.json(workspace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * @desc    Delete workspace (only owner)
 * @route   DELETE /api/work/:id
 * @access  Private
 */
export const deleteWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // --- CASCADING DELETE LOGIC ---
    // 2. Delete all files and folders associated with this workspace
    await File.deleteMany({ workspace: workspaceId });
    await Chat.deleteMany({ workspaceId: workspaceId });
    // 3. Remove the workspace reference from all participants
    await User.updateMany(
      { _id: { $in: workspace.participants } },
      { $pull: { workspaces: workspaceId } }
    );

    // 4. Finally, delete the workspace itself
    await workspace.deleteOne();

    return res.json({ message: "Workspace and all associated files deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};