const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get chat history directly with a specific user
// @route   GET /api/messages/:otherUserId
// @access  Private
router.get('/:otherUserId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.otherUserId },
                { sender: req.params.otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        // Optionally mark incoming as read
        await Message.updateMany(
            { sender: req.params.otherUserId, receiver: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

// @desc    Get all unique users the current user has chatted with
// @route   GET /api/messages/conversations/list
// @access  Private
router.get('/conversations/list', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find all messages involving the user
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ createdAt: -1 });

        // Extract unique partners
        const partnersMap = new Map();
        
        for (let msg of messages) {
            const partnerId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
            if (!partnersMap.has(partnerId)) {
                // Get the latest message for the preview
                partnersMap.set(partnerId, {
                    partnerId,
                    lastMessage: msg.content,
                    date: msg.createdAt,
                    unreadCount: msg.receiver.toString() === userId && !msg.isRead ? 1 : 0
                });
            } else {
                if (msg.receiver.toString() === userId && !msg.isRead) {
                    const data = partnersMap.get(partnerId);
                    data.unreadCount += 1;
                    partnersMap.set(partnerId, data);
                }
            }
        }

        // Hydrate partner details from User collection
        const conversationList = [];
        for (let [id, data] of partnersMap) {
            const user = await User.findById(id).select('username placeholderId');
            if (user) {
                conversationList.push({
                    user,
                    ...data
                });
            }
        }

        res.json(conversationList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching conversations' });
    }
});

module.exports = router;
