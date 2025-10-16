// src/components/RenameWorkspaceModal.jsx

import React, { useState, useEffect } from 'react';
import { X, LoaderCircle } from 'lucide-react';

export default function RenameWorkspaceModal({ isOpen, onClose, workspace, onWorkspaceRenamed }) {
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (workspace) {
      setNewName(workspace.name);
    }
  }, [workspace]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName === workspace.name) {
      onClose();
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3333/api/work/${workspace._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to rename workspace.');

      onWorkspaceRenamed(data); // Pass the updated workspace back
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2d2d2d] rounded-lg shadow-xl w-full max-w-md border border-neutral-700">
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Rename Workspace</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label htmlFor="workspaceName" className="block text-sm font-medium text-neutral-300 mb-2">
              New workspace name
            </label>
            <input
              id="workspaceName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-[#252526] border border-neutral-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end items-center p-4 bg-[#252526] rounded-b-lg border-t border-neutral-700 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-neutral-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50">
              {isLoading && <LoaderCircle size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}