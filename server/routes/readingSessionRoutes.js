const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const readingSessionController = require('../controllers/readingSessionController');

router.post('/start', protect, readingSessionController.startSession);
router.post('/end', protect, readingSessionController.endSession);
router.post('/end-batch', protect, readingSessionController.endMultipleSessions);

module.exports = router;
