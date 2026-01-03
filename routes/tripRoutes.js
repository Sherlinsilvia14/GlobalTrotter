const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const tripController = require('../controllers/tripController');

// @route   POST /trips
// @desc    Create a trip
// @access  Private
router.post('/', auth, tripController.createTrip);

// @route   GET /trips/user/:userId
// @desc    Get all trips of a user
// @access  Private (or Public if we allowed viewing others profile, but kept it auth for now)
router.get('/user/:userId', auth, tripController.getUserTrips);

// @route   DELETE /trips/:tripId
// @desc    Delete a trip
// @access  Private
router.delete('/:tripId', auth, tripController.deleteTrip);

// @route   PUT /trips/share/:tripId
// @desc    Make trip public/private
// @access  Private
router.put('/share/:tripId', auth, tripController.shareTrip);

// @route   GET /trips/public/:tripId
// @desc    View public shared trip
// @access  Private (Logged in users can view public trips) - or Public?
// Requirement implies viewing a shared trip. Usually this doesn't need login, but since I have auth middleware handy:
// The requirement said "Auth: ... JWT-based". I'll keep it behind auth for simplicity unless specified otherwise.
// Wait, "View public shared trip" implies maybe non-users can see it?
// I'll make this route PUBLIC in middleware sense (optional auth?), but for now I'll attach 'auth' to access req.user.id for the 'private check' logic inside controller.
// Actually, let's allow public access.
// We need a middleware that *tries* to get user but doesn't fail if not present?
// Or just remove auth middleware and handle logic inside?
// For safety, let's keep it generally open but logic checks is_public.
router.get('/public/:tripId', auth, tripController.getPublicTrip);

module.exports = router;
