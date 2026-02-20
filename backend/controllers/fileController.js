import  File from "../models/fileModel.js";

// Create a new file in a workspace
export const createFile = async (req, res) => {
  try {
    const { workspace, filename, language, content = '' } = req.body;
    const creatorId = req.user._id;

    const newFile = await File.create({
      workspace,
      filename,
      language,
      content,
      createdBy: creatorId,
    });

    return res.status(201).json(newFile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single file or all files in a workspace
export const getFile = async (req, res) => {
  try {
    // If workspace id is sent in query → return list of files for that workspace
    if (req.query.workspace) {
      const files = await File.find({ workspace: req.query.workspace });
      return res.json(files);
    }

    // Otherwise return individual file by id
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.json(file);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a file
export const updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const updates = req.body;

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      updates,
      { new: true }
    );

    return res.json(updatedFile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a file
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    await File.findByIdAndDelete(fileId);

    return res.json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

