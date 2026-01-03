const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const cityController = require('../controllers/cityController');

// @route   POST /cities
// @desc    Add city to trip
// @access  Private
router.post('/', auth, cityController.addCity);

// @route   GET /cities/:tripId
// @desc    Get cities for trip
// @access  Private
router.get('/:tripId', auth, cityController.getTripCities);

// @route   PUT /cities/reorder
// @desc    Reorder cities
// @access  Private
router.put('/reorder', auth, cityController.reorderCities);

module.exports = router;
