import React from 'react';
import { History, BellOff } from 'lucide-react';

/**
 * A styled panel for displaying the recent activity feed in the dashboard sidebar.
 */
export default function RecentActivity() {
  return (
    <div className="bg-[#252526] border border-neutral-700/80 p-4 rounded-lg">
      <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-4">
        <History size={16} className="text-cyan-400" />
        <span>Recent Activity</span>
      </h3>
      <div className="text-center text-neutral-500 py-4 border-t border-neutral-700/50">
        <BellOff size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity to show.</p>
      </div>
    </div>
  );
}