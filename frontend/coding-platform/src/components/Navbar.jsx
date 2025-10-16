import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, LogOut, ChevronDown } from 'lucide-react';

/**
 * The Navbar component provides top-level navigation and user actions.
 * It displays the app logo and a user dropdown menu with a logout option.
 */
export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#252526]/80 backdrop-blur-lg sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 border-b border-neutral-700/80">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white hover:text-cyan-400 transition-colors">
          <Code2 size={24} />
          <span>Codemate</span>
        </Link>
        
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="flex items-center space-x-2 bg-neutral-700/50 hover:bg-neutral-700 p-1.5 pl-3 rounded-full transition-colors"
            >
                {/* User Avatar/Initial */}
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-200 text-sm hidden sm:block">{user.username}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-48 bg-[#2D2D2D] border border-neutral-700 rounded-md shadow-xl py-1"
                >
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>
    </header>
  );
}