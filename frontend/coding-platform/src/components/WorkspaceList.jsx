import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import { Plus, LoaderCircle, AlertTriangle, Users, Clock, Briefcase } from 'lucide-react';

export default function WorkspaceList() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3333/api/work', {
        credentials: 'include',
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

  useEffect(() => {
    if (user) fetchWorkspaces();
  }, [user]);

  const handleWorkspaceCreated = () => fetchWorkspaces();
  
  if (isLoading) return (
    <div className="flex justify-center items-center py-20">
        <LoaderCircle size={32} className="animate-spin text-cyan-400" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20 px-6 bg-[#252526] rounded-lg border border-red-500/30">
        <AlertTriangle size={40} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-red-400">Error Fetching Data</h3>
        <p className="text-neutral-400">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Workspaces</h1>
          <p className="text-neutral-400 mt-1">All your collaborative projects in one place.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus size={18} />
          Create Workspace
        </button>
      </div>

      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workspaces.map((ws) => (
            <Link to={`/workspace/${ws._id}`} key={ws._id} className="group">
              <div className="bg-[#252526] border border-neutral-700/80 p-5 rounded-lg h-full flex flex-col justify-between hover:border-cyan-400/80 hover:-translate-y-1 transition-all duration-200 ease-out">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">{ws.name}</h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    Owned by {ws.owner?.username === user?.username ? 'You' : ws.owner?.username}
                  </p>
                </div>
                <div className="border-t border-neutral-700/50 pt-3 mt-4 flex items-center justify-between text-sm text-neutral-500">
                  <span className="flex items-center gap-1.5"><Users size={14}/> {ws.participants?.length || 0} Members</span>
                  <span className="flex items-center gap-1.5"><Clock size={14}/> {new Date(ws.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-[#252526] rounded-lg border border-dashed border-neutral-700">
          <Briefcase size={48} className="mx-auto text-neutral-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No workspaces yet!</h3>
          <p className="text-neutral-400 mb-6">Click the button above to create your first one.</p>
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