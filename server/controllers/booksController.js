const bookModel = require('../models/bookModel');

// Get all published books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.getAllPublishedBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single book with pages
exports.getBookDetails = async (req, res) => {
  try {
    const book = await bookModel.getBookWithPages(req.params.bookId);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create book
exports.createBook = async (req, res) => {
  try {
    const book = await bookModel.createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update book
exports.updateBook = async (req, res) => {
  try {
    const book = await bookModel.updateBook(req.params.bookId, req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
