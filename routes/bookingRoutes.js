const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getMyRequests, 
    getIncomingRequests, 
    updateBookingStatus 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Note: All booking routes generally require the user to be logged in
router.post('/', protect, createBooking);
router.get('/my-requests', protect, getMyRequests);
router.get('/incoming-requests', protect, getIncomingRequests);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
