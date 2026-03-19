const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. REGISTER A NEW NEIGHBOR ---
const registerUser = async (req, res) => {
    try {
        const { username, email, password, phoneNumber, neighborhood } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A neighbor with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            neighborhood: neighborhood || 'Kahawa West'
        });

        await newUser.save();
        res.status(201).json({ message: "Neighbor registered successfully!" });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// --- 2. LOGIN AN EXISTING NEIGHBOR ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Check if the password matches the shredded one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Generate the VIP Pass (Token)
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful!",
            token: token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};


module.exports = { registerUser, loginUser };