const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const activityController = require('../controllers/activityController');

// @route   POST /activities
// @desc    Add activity
// @access  Private
router.post('/', auth, activityController.addActivity);

// @route   GET /activities/:cityId
// @desc    Get activities
// @access  Private
router.get('/:cityId', auth, activityController.getCityActivities);

// @route   DELETE /activities/:activityId
// @desc    Delete activity
// @access  Private
router.delete('/:activityId', auth, activityController.deleteActivity);

module.exports = router;
