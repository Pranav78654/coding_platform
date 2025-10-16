// src/components/modals/InviteMemberModal.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useAlert } from "../context/AlertContext"; // 1. Import useAlert

import { X, Search, LoaderCircle, UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function InviteMemberModal({ isOpen, onClose, workspaceId }) {
  const [searchQuery, setSearchQuery] = useState("");
    const { showAlert } = useAlert(); // 2. Get the showAlert function

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inviteStatus, setInviteStatus] = useState({}); // Tracks status per user ID

  // Debounce effect for searching
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:3333/api/users/search?search=${searchQuery}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleInvite = async (user) => {
    setInviteStatus(prev => ({ ...prev, [user._id]: "sending" }));
    try {
      const res = await fetch(`http://localhost:3333/api/invitation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          workspaceId: workspaceId,
          inviteeEmail: user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send invitation");
      
      setInviteStatus(prev => ({ ...prev, [user._id]: "sent" }));

    } catch (err) {
      console.error("Invitation Error:", err);
      setInviteStatus(prev => ({ ...prev, [user._id]: "error" }));
     showAlert(err.message, "Invitation Failed");  // Simple error feedback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2d2d2d] rounded-lg shadow-xl w-full max-w-md border border-neutral-700">
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">Invite Members</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or email..."
              className="w-full bg-[#252526] border border-neutral-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="h-64 overflow-y-auto pr-2">
            {isLoading && (
              <div className="flex justify-center items-center h-full text-neutral-400">
                <LoaderCircle className="animate-spin mr-2" /> Searching...
              </div>
            )}
            {!isLoading && error && <p className="text-red-400 text-center">{error}</p>}
            
            {!isLoading && searchResults.length > 0 && (
              <ul className="space-y-2">
                {searchResults.map((user) => (
                  <li key={user._id} className="flex items-center justify-between p-2 bg-neutral-700/50 rounded">
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-xs text-neutral-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleInvite(user)}
                      disabled={inviteStatus[user._id] === 'sending' || inviteStatus[user._id] === 'sent'}
                      className="flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${inviteStatus[user._id] === 'sent'
                          ? 'bg-green-500/80 text-white'
                          : inviteStatus[user._id] === 'sending'
                          ? 'bg-cyan-600/50 text-cyan-200'
                          : 'bg-cyan-500 hover:bg-cyan-600 text-black'
                        }"
                    >
                      {inviteStatus[user._id] === 'sending' && <LoaderCircle size={16} className="animate-spin" />}
                      {inviteStatus[user._id] === 'sent' && <CheckCircle size={16} />}
                      {inviteStatus[user._id] === 'error' && <AlertCircle size={16} />}
                      <span className="ml-2">
                        {inviteStatus[user._id] === 'sending' ? 'Sending...' :
                         inviteStatus[user._id] === 'sent' ? 'Sent' :
                         inviteStatus[user._id] === 'error' ? 'Retry' :
                         'Invite'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && searchQuery && searchResults.length === 0 && (
                 <p className="text-neutral-500 text-center pt-8">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}