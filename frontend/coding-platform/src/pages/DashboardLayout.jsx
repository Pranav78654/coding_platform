import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InvitationsPanel from '../components/InvitationsPanel';
import RecentActivity from '../components/RecentActivity';

export default function DashboardLayout() {
  const location = useLocation();

  // Check if the current path is the workspace page
  const isWorkspacePage = location.pathname.startsWith('/workspace');

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white font-sans">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        {/* On workspace pages, we remove the max-width and padding to allow for a full-bleed UI */}
        {isWorkspacePage ? (
          <Outlet />
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Content Area (e.g., WorkspaceList) */}
            <div className="lg:col-span-2">
              <Outlet />
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-24">
              <InvitationsPanel />
              <RecentActivity />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}