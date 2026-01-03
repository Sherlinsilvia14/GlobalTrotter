const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const budgetController = require('../controllers/budgetController');

// @route   GET /budget/:tripId
// @desc    Get trip budget
// @access  Private
router.get('/:tripId', auth, budgetController.getTripBudget);

module.exports = router;
