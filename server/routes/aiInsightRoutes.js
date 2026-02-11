const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const aiInsightController = require('../controllers/aiInsightController');

router.post('/', protect, aiInsightController.saveInsight);
router.get('/:child_id', protect, aiInsightController.getInsightsByChild);

module.exports = router;
