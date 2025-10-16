import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import workspaceRoute from "./routes/workspaceRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import chatRoute from "./routes/chatRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import sessionRoute from "./routes/sessionRoute.js";
import invitationRoute from "./routes/invitationRoute.js"
import registerVoiceSocket from "./sockets/voiceSocket.js";
import registerTextSocket from "./sockets/textSocket.js";
import geminiRoutes from "./routes/geminiRoutes.js"
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true, // allow cookies with socket.io
  },
});

// ✅ Enable CORS for Express routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/work", workspaceRoute);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/session", sessionRoute);
app.use("/api/invitation" , invitationRoute);
app.use("/api/gemini", geminiRoutes);
// Register all socket logic
app.set("io", io);
registerTextSocket(io);
// registerVoiceSocket(io);

// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
