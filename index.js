import express from "express";
import dotenv from "dotenv";
import http from "http";                     // 👈 NEW
import { Server } from "socket.io"; 

import connectDB from "./config/database.js"
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import workspaceRoute from "./routes/workspaceRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import chatRoute from "./routes/chatRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";

// import the socket handlers
import registerVoiceSocket from "./sockets/voiceSocket.js";
import registerTextSocket from "./sockets/textSocket.js";


dotenv.config();


const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: { origin: "*" }
});  

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/work" , workspaceRoute);
app.use("/api/file" , fileRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/reviews", reviewRoutes);



// Register all socket logic
app.set("io", io); 
// registerVoiceSocket(io);
registerTextSocket(io);

// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {            
    console.log(`Server running on port ${PORT}`);
  });
});
