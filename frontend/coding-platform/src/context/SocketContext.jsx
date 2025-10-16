// src/context/SocketContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext that provides the logged-in user

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth(); // Get the logged-in user
  const [socket, setSocket] = useState(null);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    if (user) {
      // Establish connection, passing user ID for personal notifications
      const newSocket = io('http://localhost:3333', {
        query: { userId: user._id },
        withCredentials: true,
      });
      setSocket(newSocket);

      // Fetch initial pending invitations
      const fetchInvitations = async () => {
        try {
          const res = await fetch('http://localhost:3333/api/invitation', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setInvitations(data);
          }
        } catch (error) {
          console.error("Failed to fetch invitations:", error);
        }
      };
      fetchInvitations();

      // Listen for new invitations in real-time
      newSocket.on('new-invitation', (newInvitation) => {
        setInvitations((prevInvitations) => [...prevInvitations, newInvitation]);
      });

      // Clean up on disconnect
      return () => newSocket.disconnect();
    }
  }, [user]);

  const value = {
    socket,
    invitations,
    setInvitations, // Allow components to update the list (e.g., after accepting/declining)
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};