const express = require('express');
const router = express.Router();
const { createReview, getToolReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/tool/:id', getToolReviews);

module.exports = router;
