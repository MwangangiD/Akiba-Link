// 1. Load environment variables
require('dotenv').config();

// 2. Import tools
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Initialize Express
const app = express();

// 4. Middleware
app.use(cors()); 
app.use(express.json()); 

// 5. --- THE ROUTES ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 

// 👇 The exact fix for your ReferenceError is right here 👇
const toolsRoutes = require('./routes/toolsRoutes');
app.use('/api/tools', toolsRoutes);
// 👆 -------------------------------------------------- 👆

// 6. Connect to MongoDB
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => console.log("✅ Akiba-Link Database Connected!"))
    .catch((err) => console.error("❌ Database Connection Failed:", err.message));

// 7. Temporary Test Route
app.get('/', (req, res) => {
    res.send("Welcome to the Akiba-Link API!");
});

// 8. Start the Engine
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});