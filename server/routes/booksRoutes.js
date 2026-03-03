const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const booksController = require('../controllers/booksController');

// Protected routes (admin only for create/update/delete)
router.post('/', protect, booksController.createBook);
router.get('/', protect, booksController.getAllBooks);
router.get('/:id', protect, booksController.getBookById);
router.put('/:id', protect, booksController.updateBook);
router.delete('/:id', protect, booksController.deleteBook);

router.get('/:id/pages', protect, booksController.getPagesByBook);
router.get('/:id/pages/:page_number', protect, booksController.getPageByNumber);

module.exports = router;
