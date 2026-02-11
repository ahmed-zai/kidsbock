const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/readingSessionController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/start', protect, sessionController.startSession);
router.put('/end/:sessionId', protect, sessionController.endSession);

module.exports = router;
