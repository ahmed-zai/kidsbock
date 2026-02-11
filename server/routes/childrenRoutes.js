const express = require('express');
const router = express.Router();
const childrenController = require('../controllers/childrenController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Protected routes
router.post('/', protect, childrenController.createChild);
router.get('/', protect, childrenController.getChildrenByUser);
router.put('/:childId', protect, childrenController.updateChild);
router.delete('/:childId', protect, childrenController.deleteChild);

module.exports = router;
