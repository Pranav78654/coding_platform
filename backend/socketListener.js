// this is a temp file noly for testing
import { io } from "socket.io-client";

const socket = io("http://localhost:3333");

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  socket.emit("join-chat-workspace", "68a400f533131cc6f2fc6375");
});

socket.on("new-message", (msg) => {
  console.log("new-message received:", msg);
});
