const express = require('express');
const router = express.Router();
const audioEventController = require('../controllers/audioEventController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, audioEventController.addAudioEvent);

module.exports = router;
