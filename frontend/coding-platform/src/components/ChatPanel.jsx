// src/components/workspace/ChatPanel.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import { useSocket } from '../context/SocketContext'; // Adjust path if needed
import { Send, LoaderCircle } from 'lucide-react';

export default function ChatPanel({ workspaceId }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch initial messages and set up socket listeners
  useEffect(() => {
    if (!workspaceId) return;

    // Fetch initial chat history
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/chat/${workspaceId}/messages`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();

    // Socket.IO listeners
    if (socket) {
      socket.emit('join-chat-workspace', workspaceId);

      const handleNewMessage = (message) => {
        setMessages((prev) => [...prev, message]);
      };
      const handleMessageDeleted = (deletedInfo) => {
        setMessages(prev => prev.map(msg => 
            msg._id === deletedInfo._id 
            ? { ...msg, message: deletedInfo.message, isDeleted: true } 
            : msg
        ));
      };

      socket.on('new-message', handleNewMessage);
      socket.on('message-deleted', handleMessageDeleted);
      
      // Cleanup on component unmount or workspace change
      return () => {
        socket.off('new-message', handleNewMessage);
        socket.off('message-deleted', handleMessageDeleted);
      };
    }
  }, [workspaceId, socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    
    // The API call to save the message and trigger the backend socket emit
    try {
      const res = await fetch(`http://localhost:3333/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          workspaceId: workspaceId,
          message: newMessage,
        }),
      });

      if (!res.ok) {
        // Log the error if the API call fails
        const errorData = await res.json();
        console.error("Failed to send message:", errorData.message);
      }
      
      setNewMessage(''); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <div className="h-full flex flex-col">
      <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider flex-shrink-0">Chat</h3>
      
      <div className="flex-1 mb-2 overflow-y-auto pr-2 space-y-4">
        {isLoading ? (
            <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin text-cyan-400"/></div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`flex flex-col ${user._id === msg.senderId._id ? 'items-end' : 'items-start'}`}>
              <div className={`p-2 rounded-lg max-w-xs ${user._id === msg.senderId._id ? 'bg-cyan-600 text-white' : 'bg-neutral-700 text-gray-300'}`}>
                {user._id !== msg.senderId._id && (
                  <p className="text-xs font-bold text-cyan-400 mb-1">{msg.senderId.username}</p>
                )}
                <p className={`text-sm ${msg.isDeleted ? 'italic text-neutral-400' : ''}`}>{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button type="submit" className="bg-cyan-500 text-black p-2 rounded hover:bg-cyan-600 transition-colors">
            <Send size={20} />
        </button>
      </form>
    </div>
  );
}