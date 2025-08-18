const express = require('express');
require('dotenv').config();
import connectDB from './config/database';




const app = express();

// Middleware
app.use(express.json());

// Routes




// Start server after DB connects
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
