import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// ===============================
// Configuration
// ===============================

const PORT = 5000;

const MONGO_URI = 'mongodb://127.0.0.1:27017/shopping-cart';

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// MongoDB Connection
// ===============================

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.log('MongoDB connection failed');
        console.log(error);
    });

// ===============================
// Test Route
// ===============================

app.get('/', (req, res) => {
    res.json({
        message: 'Shopping Cart API is running'
    });
});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});