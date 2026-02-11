const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const childController = require('../controllers/childController');

// Protected routes
router.post('/', protect, childController.createChild);
router.get('/', protect, childController.getChildren);
router.get('/:id', protect, childController.getChildById);
router.put('/:id', protect, childController.updateChild);
router.delete('/:id', protect, childController.deleteChild);

module.exports = router;
