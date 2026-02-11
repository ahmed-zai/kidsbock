const express = require('express');
const router = express.Router();
const pageEventController = require('../controllers/pageEventController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, pageEventController.addPageEvent);

module.exports = router;
