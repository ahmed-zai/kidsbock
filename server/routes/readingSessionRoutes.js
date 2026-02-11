const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const readingSessionController = require('../controllers/readingSessionController');

router.post('/start', protect, readingSessionController.startSession);
router.put('/end', protect, readingSessionController.endSession);

module.exports = router;
