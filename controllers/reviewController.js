const Review = require('../models/Review');
const Tool = require('../models/Tool');

// @desc    Add a review for a tool
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { toolId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        // Ensure the tool exists
        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Prevent reviewing your own tool
        if (tool.owner.toString() === reviewerId) {
            return res.status(400).json({ message: 'You cannot review your own tool' });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ tool: toolId, reviewer: reviewerId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this tool' });
        }

        const newReview = new Review({
            tool: toolId,
            reviewer: reviewerId,
            rating: Number(rating),
            comment
        });

        await newReview.save();

        // Update the Tool's average rating
        const reviews = await Review.find({ tool: toolId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

        await Tool.findByIdAndUpdate(toolId, { 
            rating: avgRating,
            numReviews: numReviews
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
           return res.status(400).json({ message: 'You have already reviewed this tool' });
        }
        res.status(500).json({ message: 'Server error adding review' });
    }
};

// @desc    Get all reviews for a specific tool
// @route   GET /api/reviews/tool/:id
// @access  Public
const getToolReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ tool: req.params.id })
            .populate('reviewer', 'username')
            .sort({ createdAt: -1 });
            
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
};

module.exports = {
    createReview,
    getToolReviews
};
