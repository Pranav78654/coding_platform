import User from "../models/userModel.js";
import Workspace from "../models/workspaceModel.js"; // Import Workspace model for cleanup

// Your getAllUsers function is perfect, no changes needed.
export const getAllUsers = async (req, res) => {
  // ... your existing code ...
};

/**
 * @desc    Get a single user by their ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
  try {
    // --- IMPROVEMENT ---
    // Populate the 'workspaces' field to get details about each workspace.
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("workspaces", "name owner"); // Fetches name and owner of each workspace

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    if (
      req.user.role != "ta" &&
      req.user._id.toString() != user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Your updateUser function is perfect, no changes needed.
export const updateUser = async (req, res) => {
  // ... your existing code ...
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private (Self or TA)
 */
export const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (
      req.user._id.toString() !== userToDelete._id.toString() &&
      req.user.role !== "ta"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }

    // --- IMPROVEMENT: DATABASE CLEANUP ---

    // 1. Find all workspaces owned by this user.
    const ownedWorkspaces = await Workspace.find({ owner: userToDelete._id });
    const ownedWorkspaceIds = ownedWorkspaces.map(ws => ws._id);

    // 2. Remove this user from the participants list of all other workspaces.
    await Workspace.updateMany(
      { participants: userToDelete._id, _id: { $nin: ownedWorkspaceIds } },
      { $pull: { participants: userToDelete._id } }
    );
    
    // 3. Delete all workspaces owned by this user.
    if(ownedWorkspaceIds.length > 0) {
        await Workspace.deleteMany({ _id: { $in: ownedWorkspaceIds } });
    }

    // 4. Finally, delete the user themselves.
    await userToDelete.deleteOne();

    res.status(200).json({ message: "User and associated workspaces deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
