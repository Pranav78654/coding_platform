import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

/**
 * The main page for an individual workspace, featuring a three-panel, IDE-style layout.
 */
export default function WorkspacePage() {
  const { workspaceId } = useParams(); // Get the ID from the URL
  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3333/api/work/${workspaceId}`, {
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch workspace details.');
        }
        const data = await res.json();
        setWorkspace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId]); // Refetch if the ID in the URL changes

  if (isLoading) return <div className="text-center p-10">Loading Workspace...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!workspace) return <div className="text-center p-10">Workspace not found.</div>;

  return (
    <div className="flex h-[calc(100vh-120px)]"> {/* Adjust height to fit within the layout */}
      
      {/* Left Panel: File Explorer */}
      <div className="w-1/5 bg-gray-800 p-4 flex flex-col">
        <div className="mb-4">
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-cyan-400">&larr; Back to Dashboard</Link>
            <h2 className="text-xl font-bold mt-1">{workspace.name}</h2>
        </div>
        <div className="flex space-x-2 mb-4">
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm py-1 rounded">New File</button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm py-1 rounded">New Folder</button>
        </div>
        <div className="flex-1 overflow-y-auto">
            <p className="text-gray-500">File tree will be here...</p>
        </div>
      </div>

      {/* Center Panel: Code Editor */}
      <div className="w-3/5 bg-gray-900 flex flex-col">
        <div className="flex-shrink-0 bg-gray-800 p-2">
            <p className="text-gray-400">Editor tabs will be here...</p>
        </div>
        <div className="flex-1 p-4">
            <p className="text-gray-500">Monaco code editor will be here...</p>
        </div>
      </div>

      {/* Right Panel: Collaboration */}
      <div className="w-1/5 bg-gray-800 p-4 flex flex-col">
        <div className="mb-4">
            <h3 className="font-bold">Participants</h3>
            <div className="mt-2 space-y-2">
                {workspace.participants.map(p => <div key={p._id}>{p.username}</div>)}
            </div>
            <button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-black text-sm font-semibold py-2 rounded-lg">+ Invite</button>
        </div>
        <div className="flex-1 border-t border-gray-700 pt-4 flex flex-col">
            <h3 className="font-bold mb-2">Chat</h3>
            <div className="flex-1 mb-2">
                <p className="text-gray-500">Chat messages...</p>
            </div>
            <input type="text" placeholder="Type a message..." className="w-full p-2 bg-gray-700 rounded"/>
        </div>
      </div>
    </div>
  );
}
