const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');

// @route   GET /api/tools
// @desc    Get all tools in the database
router.get('/', async (req, res) => {
    try {
        // Find all tools, and "populate" the owner field so we get the owner's username instead of just a random ID string
        const tools = await Tool.find().populate('owner', 'username neighborhood phoneNumber');
        res.json(tools);
    } catch (error) {
        console.error("Fetch Tools Error:", error.message);
        res.status(500).json({ message: 'Server error while fetching tools.' });
    }
});

// @route   POST /api/tools
// @desc    Add a new tool
router.post('/', async (req, res) => {
    try {
        const { name, description, category, condition, ownerId } = req.body;

        const newTool = new Tool({
            name,
            description,
            category,
            condition,
            owner: ownerId
        });

        await newTool.save();
        res.status(201).json(newTool);
    } catch (error) {
        console.error("Add Tool Error:", error.message);
        res.status(500).json({ message: 'Server error while adding tool.' });
    }
});

// @route   GET /api/tools/user/:userId
// @desc    Get all tools owned by a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        // Find tools where the owner matches the ID passed in the URL, sort newest first
        const myTools = await Tool.find({ owner: req.params.userId }).sort({ createdAt: -1 });
        res.json(myTools);
    } catch (error) {
        console.error("Fetch User Tools Error:", error.message);
        res.status(500).json({ message: 'Server error while fetching your tools.' });
    }
});

// @route   PUT /api/tools/:id
// @desc    Toggle a tool's availability (Available <-> In Use)
router.put('/:id', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) return res.status(404).json({ message: 'Tool not found' });

        // Flip the boolean switch (if true, make false. If false, make true)
        tool.isAvailable = !tool.isAvailable;
        await tool.save();
        
        res.json(tool);
    } catch (error) {
        console.error("Update Tool Error:", error.message);
        res.status(500).json({ message: 'Server error while updating tool.' });
    }
});

// @route   DELETE /api/tools/:id
// @desc    Delete a tool from the database
router.delete('/:id', async (req, res) => {
    try {
        await Tool.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tool successfully deleted' });
    } catch (error) {
        console.error("Delete Tool Error:", error.message);
        res.status(500).json({ message: 'Server error while deleting tool.' });
    }
});

module.exports = router;