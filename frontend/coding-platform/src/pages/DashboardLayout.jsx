import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InvitationsPanel from '../components/InvitationsPanel';
import RecentActivity from '../components/RecentActivity';

export default function DashboardLayout() {
  const location = useLocation();

  // Check if current path starts with /workspace
  const isWorkspacePage = location.pathname.startsWith('/workspace');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div
          className={`max-w-7xl mx-auto ${
            isWorkspacePage ? 'grid grid-cols-1' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'
          }`}
        >
          {/* Main Content Area - Renders the page component */}
          <div className={isWorkspacePage ? 'col-span-1' : 'lg:col-span-2'}>
            <Outlet />
          </div>

          {/* Only show on dashboard, NOT on workspace pages */}
          {!isWorkspacePage && (
            <div className="space-y-8">
              <InvitationsPanel />
              <RecentActivity />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
