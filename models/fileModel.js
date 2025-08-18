const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'javascript',
    },
    content: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', FileSchema);
