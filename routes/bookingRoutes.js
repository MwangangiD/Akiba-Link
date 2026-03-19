const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getMyRequests, 
    getIncomingRequests, 
    updateBookingStatus 
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Note: All booking routes generally require the user to be logged in
router.post('/', auth, createBooking);
router.get('/my-requests', auth, getMyRequests);
router.get('/incoming-requests', auth, getIncomingRequests);
router.put('/:id/status', auth, updateBookingStatus);

module.exports = router;
