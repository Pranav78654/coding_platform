import express from 'express';
import cookieParser from "cookie-parser";

require('dotenv').config();
import connectDB from './config/database';

import userRoutes from './routes/userRoute';
import errorHandler from './middleware/errorHandler';
import profileRouter from './routes/profile';
import sessionRoutes from './routes/sessionRoute';
import handRaiseRoute from './routes/handRaiseRoute';
const app = express();

// Middleware
app.use(cookieParser());
app.use(json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/', profileRouter);
app.use('/api/session', sessionRoutes);
app.use('/api/hand', handRaiseRoute);
// Error Handling Middleware
app.use(errorHandler);

// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
