const express = require('express');
const router = express.Router();
const aiInsightController = require('../controllers/aiInsightController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, aiInsightController.saveInsight);
router.get('/:childId', protect, aiInsightController.getChildInsights);

module.exports = router;
