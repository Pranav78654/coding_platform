

export default function registerTextSocket(io) {
  io.on("connection", (socket) => {
    console.log("💬 [text] Socket connected:", socket.id);

   
    socket.on("join-chat-workspace", (workspaceId) => {
      socket.join(workspaceId);
    });

   
    socket.on("new-message", ({ workspaceId, message }) => {
      
      socket.to(workspaceId).emit("new-message", message);
    });
  });
}
