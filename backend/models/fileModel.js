import mongoose from "mongoose";

const FileSystemItemSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    // The name of the file or folder (e.g., "index.js", "src")
    name: {
      type: String,
      required: true,
    },
    // --- NEW FIELD ---
    // Distinguishes between files and folders
    type: {
      type: String,
      enum: ['file', 'folder'],
      required: true,
    },
    // --- NEW FIELD ---
    // The ID of the parent folder. Null for root items.
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FileSystemItem', // Self-referencing
      default: null,
    },
    // Content is only relevant for items of type 'file'
    content: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'plaintext',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Rename the export to be more generic
export default mongoose.model('FileSystemItem', FileSystemItemSchema);
