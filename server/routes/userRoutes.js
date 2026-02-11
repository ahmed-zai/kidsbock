const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validateRegister } = require('../middleware/validateMiddleware');

// Public routes
router.post('/register', validateRegister, userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/:id/profile', protect, userController.getUserProfile);
router.put('/:id/plan', protect, userController.updatePlan);

module.exports = router;
