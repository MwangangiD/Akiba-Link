const Booking = require('../models/Booking');
const Tool = require('../models/Tool');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { toolId, startDate, endDate, message } = req.body;
        const renterId = req.user.id;

        // Ensure the tool exists
        const tool = await Tool.findById(toolId);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Prevent booking your own tool
        if (tool.owner.toString() === renterId) {
            return res.status(400).json({ message: 'You cannot book your own tool' });
        }

        const newBooking = new Booking({
            tool: toolId,
            renter: renterId,
            owner: tool.owner,
            startDate,
            endDate,
            message
        });

        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating booking request' });
    }
};

// @desc    Get all bookings made by the current user (Outgoing Requests)
// @route   GET /api/bookings/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
    try {
        const bookings = await Booking.find({ renter: req.user.id })
            .populate('tool', 'name images')
            .populate('owner', 'username phoneNumber neighborhood')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching your requests' });
    }
};

// @desc    Get all bookings requested for the current user's tools (Incoming Requests)
// @route   GET /api/bookings/incoming-requests
// @access  Private
const getIncomingRequests = async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user.id })
            .populate('tool', 'name images')
            .populate('renter', 'username phoneNumber neighborhood email')
            .sort({ createdAt: -1 });
            
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching incoming requests' });
    }
};

// @desc    Approve, reject, or complete a booking
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner only)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only the owner of the tool can approve/reject the booking (or renter to cancel)
        if (booking.owner.toString() !== req.user.id && booking.renter.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        // Optional: If approved, we could automatically mark the tool as 'isAvailable: false'
        if (status === 'approved') {
            await Tool.findByIdAndUpdate(booking.tool, { isAvailable: false });
        } else if (status === 'completed' || status === 'cancelled') {
            await Tool.findByIdAndUpdate(booking.tool, { isAvailable: true });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating booking status' });
    }
};

module.exports = {
    createBooking,
    getMyRequests,
    getIncomingRequests,
    updateBookingStatus
};
