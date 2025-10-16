import FileSystemItem from "../models/fileModel.js";
import Workspace from "../models/workspaceModel.js";

/**
 * @desc    Create a new file or folder in a workspace
 * @route   POST /api/files
 * @access  Private
 */
export const createFileSystemItem = async (req, res) => {
  try {
    const { workspaceId, name, type, parentId = null } = req.body;
    const creatorId = req.user._id;

    if (!workspaceId || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = await FileSystemItem.create({
      workspace: workspaceId,
      name,
      type,
      parent: parentId,
      createdBy: creatorId,
    });

    // Note: You might not need this if the workspace is just a container.
    // Pushing every single file ID to a workspace array can become inefficient.
    await Workspace.findByIdAndUpdate(workspaceId, {
      $push: { files: newItem._id },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get workspace file tree (nested folders/files)
 * @route   GET /api/files/workspace/:workspaceId
 * @access  Private
 */
export const getWorkspaceFileTree = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const items = await FileSystemItem.find({ workspace: workspaceId }).lean();
    const itemMap = {};
    items.forEach((item) => {
      item.children = [];
      itemMap[item._id] = item;
    });

    const tree = [];
    items.forEach((item) => {
      if (item.parent && itemMap[item.parent]) {
        itemMap[item.parent].children.push(item);
      } else {
        tree.push(item);
      }
    });

    res.status(200).json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update a file's content, rename, or move a file/folder
 * @route   PUT /api/files/:id
 * @access  Private
 */
export const updateFileSystemItem = async (req, res) => {
  try {
    const { id } = req.params;
    // ✨ FEATURE: Added parentId to handle moving files/folders
    const { name, content, parentId } = req.body;

    const item = await FileSystemItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (name) item.name = name;
    if (content !== undefined && item.type === "file") {
      item.content = content;
    }
    // ✨ FEATURE: Logic to update the item's parent (for drag & drop)
    if (parentId) {
      item.parent = parentId;
    }

    const updatedItem = await item.save();
    res.status(200).json({
      message: "Item updated successfully",
      updatedItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Delete a file or a folder (and its contents)
 * @route   DELETE /api/files/:id
 * @access  Private
 */
// ✨ FIX: Replaced with a single, robust recursive delete function
export const deleteFileSystemItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRecursively = async (itemId) => {
      const item = await FileSystemItem.findById(itemId);
      if (!item) return;

      if (item.type === "folder") {
        const children = await FileSystemItem.find({ parent: itemId });
        for (const child of children) {
          await deleteRecursively(child._id);
        }
      }

      await FileSystemItem.findByIdAndDelete(itemId);
      await Workspace.findByIdAndUpdate(item.workspace, {
        $pull: { files: itemId },
      });
    };

    await deleteRecursively(id);

    res.status(200).json({
      message: "Item and its contents deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFileSystemItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await FileSystemItem.findById(id).lean();
    if (!item) return res.status(404).json({ message: "File not found" });

    if (item.type === "folder") {
      return res.status(400).json({ message: "Folders do not have content" });
    }

    res.status(200).json({ content: item.content, name: item.name, language: item.language });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};