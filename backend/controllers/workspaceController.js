import Workspace from "../models/workspaceModel.js";
import User from "../models/userModel.js";

/**
 * @desc    Create a new workspace
 * @route   POST /api/work
 * @access  Private
 */
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const newWorkspace = await Workspace.create({
      name,
      owner: ownerId,
      participants: [ownerId], // Owner is the first participant
    });

    // --- IMPROVEMENT ---
    // Add the new workspace's ID to the owner's user document.
    await User.findByIdAndUpdate(ownerId, {
      $push: { workspaces: newWorkspace._id },
    });

    return res.status(201).json(newWorkspace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get all workspaces for the logged-in user
 * @route   GET /api/work
 * @access  Private
 */
export const getUserWorkspaces = async (req, res) => {
  try {
    // Find workspaces where the user is a participant and populate their names
    const userWithWorkspaces = await User.findById(req.user._id).populate(
      "workspaces",
      "name owner" // Select only the fields you need for the list
    );

    if (!userWithWorkspaces) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userWithWorkspaces.workspaces);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single workspace (Your existing code is great, no changes needed)
export const getWorkspace = async (req, res) => {
  // ... your existing code ...
};

// Update workspace (Your existing code is great, no changes needed)
export const updateWorkspace = async (req, res) => {
  // ... your existing code ...
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

    // Only owner can delete
    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // --- IMPROVEMENT ---
    // Remove the workspace reference from all participants.
    await User.updateMany(
      { _id: { $in: workspace.participants } },
      { $pull: { workspaces: workspaceId } }
    );

    // Now delete the workspace itself
    await workspace.deleteOne();

    return res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

