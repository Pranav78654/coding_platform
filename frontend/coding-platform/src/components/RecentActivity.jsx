import React from 'react';

/**
 * A placeholder component for the recent activity feed in the dashboard sidebar.
 */
export default function RecentActivity() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <div className="text-center text-gray-400 py-4">
        <p>No recent activity to show.</p>
        {/* We will map over real activity items here later */}
      </div>
    </div>
  );
}

