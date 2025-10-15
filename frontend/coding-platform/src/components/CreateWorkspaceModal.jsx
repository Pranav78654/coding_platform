import React, { useState } from 'react';

/**
 * A modal dialog for creating a new workspace.
 * It contains a form with a single input for the workspace name.
 */
export default function CreateWorkspaceModal({ isOpen, onClose, onWorkspaceCreated }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Return null if the modal is not open to prevent rendering
  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:3333/api/work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create workspace.');
      }

      // If successful, close the modal and trigger a data refetch in the parent
      onWorkspaceCreated();
      onClose();
      setName(''); // Reset form field
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create New Workspace</h2>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-400 mb-2">
            Workspace Name
          </label>
          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Project Phoenix"
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black font-semibold transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

