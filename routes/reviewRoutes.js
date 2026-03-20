const express = require('express');
const router = express.Router();
const { createReview, getToolReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, createReview);
router.get('/tool/:id', getToolReviews);

module.exports = router;
