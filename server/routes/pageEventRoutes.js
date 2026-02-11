const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const pageEventController = require('../controllers/pageEventController');

router.post('/', protect, pageEventController.addPageEvent);

module.exports = router;
