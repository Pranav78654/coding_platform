import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";




const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);


// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
