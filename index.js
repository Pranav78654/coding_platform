import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js"
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import workspaceRoute from "./routes/workspaceRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
dotenv.config();


const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/work" , workspaceRoute);
app.use("/api/file" , fileRoutes);


// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
