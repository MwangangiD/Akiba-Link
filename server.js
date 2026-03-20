require('dotenv').config();
const express = require('express');
const http = require('http'); // 👈 NEW: For Socket.io
const { Server } = require('socket.io'); // 👈 NEW: For Socket.io
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app); // 👈 Wrap express in HTTP server

// 📡 Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // Allow connections from frontend
        methods: ['GET', 'POST']
    }
});

// Socket Event Listeners
io.on('connection', (socket) => {
    // When a user logs in, they join a private room matching their User ID
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
    });

    // When someone sends a message
    socket.on('sendMessage', async (data) => {
        try {
            const Message = require('./models/Message');
            // Save to database
            const newMsg = await Message.create({
                sender: data.sender,
                receiver: data.receiver,
                content: data.content
            });

            // Re-fetch with populated sender logic if needed, or strictly emit
            
            // Broadcast the message immediately to the receiver and sender
            io.to(data.receiver).emit('receiveMessage', newMsg);
            io.to(data.sender).emit('receiveMessage', newMsg);
        } catch (error) {
            console.error("Socket Message Error:", error);
        }
    });

    socket.on('disconnect', () => {
        // Clean up if needed
    });
});

// --- MIDDLEWARE ---
app.use(express.json()); // Allows Express to read JSON from React
app.use(cors()); // Allows your React app (port 5173) to talk to this server

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tools', require('./routes/toolsRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

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
server.listen(PORT, () => {
    console.log(`🚀 Akiba-Link Backend running on port ${PORT}`);
});