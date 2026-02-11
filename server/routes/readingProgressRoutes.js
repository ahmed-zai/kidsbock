const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const readingProgressController = require('../controllers/readingProgressController');

router.post('/', protect, readingProgressController.updateProgress);
router.get('/:child_id', protect, readingProgressController.getProgressByChild);

module.exports = router;
