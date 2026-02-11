const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const insightController = require('../controllers/insightController');

router.post('/', protect, insightController.saveInsight);
router.get('/:child_id', protect, insightController.getInsightsByChild);

module.exports = router;
