const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', booksController.getAllBooks);
router.get('/:bookId', booksController.getBookDetails);

// Admin-only routes
router.post('/', protect, restrictTo('admin'), booksController.createBook);
router.put('/:bookId', protect, restrictTo('admin'), booksController.updateBook);

module.exports = router;
