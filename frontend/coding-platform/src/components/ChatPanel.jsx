// src/components/workspace/ChatPanel.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from "../context/AlertContext"; // 1. Import useAlert

import { useSocket } from '../context/SocketContext';
import { Send, LoaderCircle, Trash2 } from 'lucide-react';

export default function ChatPanel({ workspaceId }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
    const { showAlert } = useAlert(); // 2. Get the showAlert function


  // Auto-scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch initial messages and set up socket listeners (UNCHANGED)
  useEffect(() => {
    if (!workspaceId) return;
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
      return () => {
        socket.off('new-message', handleNewMessage);
        socket.off('message-deleted', handleMessageDeleted);
      };
    }
  }, [workspaceId, socket]);

  // handleSendMessage function (UNCHANGED)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    try {
      const res = await fetch(`http://localhost:3333/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          workspaceId: workspaceId,
          message: newMessage,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to send message:", errorData.message);
      }
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // handleDeleteMessage function (UNCHANGED)
  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await fetch(`http://localhost:3333/api/chat/delete/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete message.');
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      showAlert(error.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider flex-shrink-0">Chat</h3>
      
      <div className="flex-1 mb-2 overflow-y-auto pr-2 space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin text-cyan-400"/></div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = user._id === msg.senderId?._id;

            // --- THIS IS THE CORRECTED JSX LOGIC ---

            // Render layout for YOUR messages
            if (isMyMessage) {
              return (
                <div key={msg._id} className="flex justify-end items-center group">
                  {/* Delete button appears on hover */}
                  {!msg.isDeleted && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="mr-2 p-1.5 rounded-full text-neutral-500 hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {/* Message Bubble */}
                  <div className="bg-cyan-600 text-white p-2 rounded-lg max-w-xs">
                    <p className={`text-sm break-words ${msg.isDeleted ? 'italic text-neutral-400' : ''}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            }

            // Render layout for OTHER users' messages
            return (
              <div key={msg._id} className="flex justify-start items-start">
                {/* Avatar placeholder could go here if you add it later */}
                <div className="bg-neutral-700 text-gray-300 p-2 rounded-lg max-w-xs">
                  {!msg.isDeleted && (
                    <p className="text-xs font-bold text-cyan-400 mb-1">
                      {msg.senderId?.username}
                    </p>
                  )}
                  <p className={`text-sm break-words ${msg.isDeleted ? 'italic text-neutral-400' : ''}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
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