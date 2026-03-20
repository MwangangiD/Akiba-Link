require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); // Allows Express to read JSON from React
app.use(cors()); // Allows your React app (port 5173) to talk to this server

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tools', require('./routes/toolsRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Add a welcome route so the user knows the server is alive
app.get('/', (req, res) => {
    res.send('Akiba-Link API is running! 🚀');
});
// --- DATABASE CONNECTION ---
// 🛑 IMPORTANT: Put your actual MongoDB connection string inside these quotes!
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/'; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch((err) => console.error('❌ MongoDB connection failed:', err.message));

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Akiba-Link Backend running on port ${PORT}`);
});