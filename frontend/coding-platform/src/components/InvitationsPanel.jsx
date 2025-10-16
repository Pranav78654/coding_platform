// src/components/dashboard/InvitationsPanel.jsx

import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext'; // Adjust path if needed
import { Mail, Inbox, Check, X, LoaderCircle } from 'lucide-react';
import { useAlert } from "../context/AlertContext"; // 1. Import useAlert


export default function InvitationsPanel() {
  const { invitations, setInvitations } = useSocket();
  const [loadingId, setLoadingId] = useState(null); // To show spinner on a specific button
  const { showAlert } = useAlert(); // 2. Get the showAlert function

  const handleResponse = async (invitationId, action) => {
    setLoadingId(invitationId);
    try {
      const res = await fetch(`http://localhost:3333/api/invitation/${invitationId}/${action}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${action} invitation.`);
      }
      
      // On success, remove the invitation from the UI instantly
      setInvitations(prev => prev.filter(inv => inv._id !== invitationId));

    } catch (error) {
      console.error(error);
      showAlert(error.message); // Simple error feedback
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#252526] border border-neutral-700/80 p-4 rounded-lg">
      <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
        <Mail size={16} className="text-cyan-400" />
        <span>Invitations</span>
        {invitations.length > 0 && (
          <span className="bg-cyan-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {invitations.length}
          </span>
        )}
      </h3>
      
      <div className="space-y-2 border-t border-neutral-700/50 pt-3">
        {invitations.length === 0 ? (
          <div className="text-center text-neutral-500 py-4">
            <Inbox size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No pending invitations.</p>
          </div>
        ) : (
          invitations.map((inv) => (
            <div key={inv._id} className="bg-neutral-700/50 p-2.5 rounded-md">
              <p className="text-sm text-white mb-1">
                <span className="font-semibold">{inv.inviter.username}</span> invited you to join <span className="font-semibold text-cyan-400">{inv.workspace.name}</span>
              </p>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button 
                  onClick={() => handleResponse(inv._id, 'decline')}
                  disabled={loadingId === inv._id}
                  className="p-1.5 rounded-full bg-red-600/30 hover:bg-red-600/50 text-red-300 disabled:opacity-50"
                >
                  {loadingId === inv._id ? <LoaderCircle size={16} className="animate-spin"/> : <X size={16} />}
                </button>
                <button 
                  onClick={() => handleResponse(inv._id, 'accept')}
                  disabled={loadingId === inv._id}
                  className="p-1.5 rounded-full bg-green-600/30 hover:bg-green-600/50 text-green-300 disabled:opacity-50"
                >
                  {loadingId === inv._id ? <LoaderCircle size={16} className="animate-spin"/> : <Check size={16} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}