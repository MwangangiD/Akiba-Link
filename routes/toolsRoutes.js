const express = require('express');
const router = express.Router();

// 👇 THE IMPORT (Must have all 4 functions) 👇
const { createTool, getTools, updateTool, deleteTool } = require('../controllers/toolController');
const { protect } = require('../middleware/auth'); 

// The Routes
router.get('/', getTools);                     // Read
router.post('/', protect, createTool);         // Create
router.put('/:id', protect, updateTool);       // Update (This is the one that crashed!)
router.delete('/:id', protect, deleteTool);    // Delete

module.exports = router;