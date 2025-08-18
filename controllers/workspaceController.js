import Workspace from "../models/workspaceModel.js";

// Create a new workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, participants = [] } = req.body;
    const ownerId = req.user._id; 

    // always include owner in participants
    if (!participants.includes(ownerId)) {
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
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    return res.json(workspace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update workspace
export const updateWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const updates = req.body;

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspaceId,
      updates,
      { new: true }
    );

    return res.json(updatedWorkspace);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete workspace
export const deleteWorkspace = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    await Workspace.findByIdAndDelete(workspaceId);

    return res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
