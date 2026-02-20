

export default function registerVoiceSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔊 [voice] Socket connected:", socket.id);

  
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", { from: socket.id, offer });
    });

    
    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", { from: socket.id, answer });
    });

 
    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    
    socket.on("mute", (roomId) => {
      socket.to(roomId).emit("mute", socket.id);
    });

    socket.on("unmute", (roomId) => {
      socket.to(roomId).emit("unmute", socket.id);
    });
  });
}
