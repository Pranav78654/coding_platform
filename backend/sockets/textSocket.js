// src/sockets/textSocket.js

export default function registerTextSocket(io) {
  io.on("connection", (socket) => {
    console.log("💬 [text] Socket connected:", socket.id);

    // Join personal room for notifications (like invitations)
    const userId = socket.handshake.query.userId;
    if (userId) {
      console.log(`User ${userId} joining their personal room.`);
      socket.join(userId);
    }

    // Join a room for a specific workspace chat
    socket.on("join-chat-workspace", (workspaceId) => {
      console.log(`Socket ${socket.id} is joining chat for workspace: ${workspaceId}`);
      socket.join(workspaceId);
    });

    socket.on('disconnect', () => {
        console.log('💬 [text] Socket disconnected:', socket.id);
    });
  });
}