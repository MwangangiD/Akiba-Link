const Tool = require('../models/Tool'); // Or '../models/Tools' if you kept the 's'

// --- 1. POST A NEW TOOL ---
const createTool = async (req, res) => {
    try {
        const { toolName, category, condition, location } = req.body;
        const newTool = new Tool({
            toolName,
            category,
            condition,
            location,
            owner: req.user.id 
        });
        await newTool.save();
        res.status(201).json(newTool);
    } catch (error) {
        console.error("Error creating tool:", error);
        res.status(500).json({ message: "Failed to post tool." });
    }
};

// --- 2. GET ALL TOOLS ---
const getTools = async (req, res) => {
    try {
        const tools = await Tool.find({ isAvailable: true })
                                .populate('owner', 'username neighborhood phoneNumber');
        res.status(200).json(tools);
    } catch (error) {
        console.error("Error fetching tools:", error);
        res.status(500).json({ message: "Failed to fetch tools." });
    }
};

// --- 3. UPDATE A TOOL ---
const updateTool = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: "Tool not found." });
        }
        if (tool.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to edit this tool." });
        }
        const updatedTool = await Tool.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.status(200).json(updatedTool);
    } catch (error) {
        console.error("Error updating tool:", error);
        res.status(500).json({ message: "Failed to update tool." });
    }
};

// --- 4. DELETE A TOOL ---
const deleteTool = async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: "Tool not found." });
        }
        if (tool.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this tool." });
        }
        await tool.deleteOne();
        res.status(200).json({ id: req.params.id, message: "Tool successfully deleted." });
    } catch (error) {
        console.error("Error deleting tool:", error);
        res.status(500).json({ message: "Failed to delete tool." });
    }
};

// --- THE CRITICAL EXPORT BRIDGE ---
module.exports = { createTool, getTools, updateTool, deleteTool };