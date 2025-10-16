// src/sockets/textSocket.js

export default function registerTextSocket(io) {
  io.on("connection", (socket) => {
    console.log("💬 [text] Socket connected:", socket.id);

    // Get user ID from the socket handshake (we'll set this up on the client)
    const userId = socket.handshake.query.userId;
    if (userId) {
      console.log(`User ${userId} joining their personal room.`);
      socket.join(userId); // Join a room named after their user ID
    }

    socket.on("join-chat-workspace", (workspaceId) => {
      socket.join(workspaceId);
    });

    socket.on("new-message", ({ workspaceId, message }) => {
      socket.to(workspaceId).emit("new-message", message);
    });

    socket.on('disconnect', () => {
        console.log('💬 [text] Socket disconnected:', socket.id);
    });
  });
}