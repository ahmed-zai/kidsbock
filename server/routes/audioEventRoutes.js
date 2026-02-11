const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const audioEventController = require('../controllers/audioEventController');

router.post('/', protect, audioEventController.addAudioEvent);

module.exports = router;
