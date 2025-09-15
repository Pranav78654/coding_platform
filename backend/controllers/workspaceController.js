import Workspace from "../models/workspaceModel.js";

// Create a new workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, participants = [] } = req.body;
    const ownerId = req.user._id;

    // always include owner in participants
    if (!participants.includes(ownerId.toString())) {
      participants.push(ownerId);
    }

    const newWorkspace = await Workspace.create({
      name,
      owner: ownerId,
      participants,
    });

    return res.status(201).json(newWorkspace);
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

// Delete workspace (only owner)
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

    await workspace.deleteOne();

    return res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
