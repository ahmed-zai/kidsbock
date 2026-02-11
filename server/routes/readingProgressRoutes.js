const express = require('express');
const router = express.Router();
const progressController = require('../controllers/readingProgressController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, progressController.updateProgress);
router.get('/:childId', protect, progressController.getChildProgress);

module.exports = router;
