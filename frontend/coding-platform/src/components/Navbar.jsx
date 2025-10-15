import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We'll create this context next

/**
 * The Navbar component provides top-level navigation and user actions.
 * It displays the app logo, and a user menu with a logout option.
 */
export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend endpoint to clear the httpOnly cookie
      await fetch('http://localhost:3333/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear the user from our global state
      setUser(null);
      
      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-700">
        <Link to="/dashboard" className="text-2xl font-extrabold text-white">
          Codemate
        </Link>
        
        {user && (
          <div className="relative">
            <div className="flex items-center space-x-4">
               <span className="text-gray-300">Welcome, {user.username}</span>
               <button 
                 onClick={handleLogout}
                 className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-2 rounded-lg transition"
               >
                 Logout
               </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

