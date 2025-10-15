import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 1. Make sure Link is imported
import { useAuth } from '../context/AuthContext';
import CreateWorkspaceModal from './CreateWorkspaceModal';

/**
 * This component fetches and displays the list of workspaces for the current user.
 * It serves as the main content for the /dashboard route.
 */
export default function WorkspaceList() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch workspaces from the backend
  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3333/api/work', {
        credentials: 'include', // Important to send the cookie
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to fetch workspaces.');
      }
      const data = await res.json();
      setWorkspaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch workspaces when the component mounts or the user changes
  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  // Callback function to refetch data after a new workspace is created
  const handleWorkspaceCreated = () => {
    fetchWorkspaces();
  };
  
  if (isLoading) return <p className="text-center text-gray-400">Loading workspaces...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Workspaces</h1>
          <p className="text-gray-400">All your collaborative projects in one place.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-5 py-2 rounded-lg transition"
        >
          + Create Workspace
        </button>
      </div>

      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((ws) => (
            // --- THE KEY CHANGE ---
            // 2. Wrap the entire card div with a Link component.
            //    The 'to' prop creates the dynamic URL using the workspace's unique ID.
            <Link to={`/workspace/${ws._id}`} key={ws._id}>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700/50 transition-colors cursor-pointer h-full">
                <h3 className="text-xl font-semibold mb-2">{ws.name}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Owned by {ws.owner?.username === user?.username ? 'You' : ws.owner?.username}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{ws.participants?.length || 0} Participant(s)</span>
                  <span>Updated: {new Date(ws.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-gray-800 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No workspaces yet!</h3>
          <p className="text-gray-400 mb-4">Click the button to create your first collaborative space.</p>
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWorkspaceCreated={handleWorkspaceCreated}
      />
    </div>
  );
}

