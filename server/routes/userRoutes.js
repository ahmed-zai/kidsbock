const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/:id', protect, userController.getUserProfile);
router.put('/:id/plan', protect, userController.updatePlan);

module.exports = router;
