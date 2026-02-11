const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const audioEventController = require('../controllers/audioEventController');

router.post('/', protect, audioEventController.addAudioEvent);

module.exports = router;
