const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber
        });

        // Save to database
        await newUser.save();

        // Create the JWT Token
        const token = jwt.sign(
            { userId: newUser._id }, 
            'akiba_link_super_secret_key', 
            { expiresIn: '7d' } 
        );

        // Send success response
        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                neighborhood: newUser.neighborhood
            }
        });

    } catch (error) {
        console.error("Registration Error:", error.message);
        // Expose the actual error message to help debug MongoDB Atlas issues on Render
        res.status(500).json({ message: error.message || 'Server error during registration.' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by their email
        const user = await User.findOne({ email });
        // Also check if user.password exists to prevent bcrypt.compare from crashing!
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // 2. The Security Guard: Check if the typed password matches the scrambled database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // 3. Create a new VIP Pass (Token) for the session
        const token = jwt.sign(
            { userId: user._id }, 
            'akiba_link_super_secret_key', 
            { expiresIn: '7d' } 
        );

        // 4. Send the success response!
        res.json({
            message: 'Logged in successfully!',
            token,
            user: {
                id: user._id,
                username: user.username,
                neighborhood: user.neighborhood
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});
module.exports = router;