import React from 'react';

/**
 * A placeholder component for the invitations panel in the dashboard sidebar.
 */
export default function InvitationsPanel() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Invitations</h3>
      <div className="text-center text-gray-400 py-4">
        <p>No pending invitations.</p>
        {/* We will map over real invitations here later */}
      </div>
    </div>
  );
}

