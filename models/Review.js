const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        maxLength: 500
    }
}, { timestamps: true });

// Prevent a user from reviewing the same tool multiple times
ReviewSchema.index({ tool: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
