const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');
const userController = require('../controllers/userController');

// Public routes
router.post('/register', validateRegister, userController.registerUser);
router.post('/login', validateLogin, userController.loginUser);

// Protected routes
router.get('/me', protect, userController.getCurrentUser); // new endpoint to get logged-in user
router.get('/:id', protect, userController.getUserProfile);
router.put('/:id/plan', protect, userController.updatePlan);

module.exports = router;
