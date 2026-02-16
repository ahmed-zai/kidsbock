const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const aiInsightController = require('../controllers/aiInsightController');

// Route to get all insights for the authenticated user's children
router.get('/', protect, aiInsightController.getInsights);
// Route to get insights for a specific child
router.get('/:child_id', protect, aiInsightController.getInsights);
router.post('/', protect, aiInsightController.saveInsight);

module.exports = router;
