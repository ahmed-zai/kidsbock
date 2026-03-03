const bookModel = require('../models/bookModel');

const booksController = {

  createBook: async (req, res, next) => {
    try {
      const book = await bookModel.createBook(req.body);
      res.status(201).json({ book });
    } catch (err) {
      console.error('Error in createBook:', err);
      next(err);
    }
  },

  getAllBooks: async (req, res, next) => {
    try {
      const books = await bookModel.getAllBooks();
      res.status(200).json({ books });
    } catch (err) {
      console.error('Error in getAllBooks:', err);
      next(err);
    }
  },

  getBookById: async (req, res, next) => {
    try {
      const book = await bookModel.getBookById(req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      res.status(200).json({ book });
    } catch (err) {
      console.error('Error in getBookById:', err);
      next(err);
    }
  },

  updateBook: async (req, res, next) => {
    try {
      const updatedBook = await bookModel.updateBook(req.params.id, req.body);
      if (!updatedBook) return res.status(404).json({ message: 'Book not found or nothing to update' });
      res.status(200).json({ book: updatedBook });
    } catch (err) {
      console.error('Error in updateBook:', err);
      next(err);
    }
  },

  deleteBook: async (req, res, next) => {
    try {
      const deletedBook = await bookModel.deleteBook(req.params.id);
      if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
      res.status(200).json({ message: 'Book deleted', id: deletedBook.id });
    } catch (err) {
      console.error('Error in deleteBook:', err);
      next(err);
    }
  },

  getPagesByBook: async (req, res, next) => {
    try {
      const pages = await bookModel.getPagesByBook(req.params.id);
      res.status(200).json(pages);
    } catch (err) {
      console.error('Error in getPagesByBook:', err);
      next(err);
    }
  },

  getPageByNumber: async (req, res, next) => {
    try {
      const { id, page_number } = req.params;
      const page = await bookModel.getPageByNumber(id, page_number);
      if (!page) return res.status(404).json({ message: 'Page not found' });
      res.status(200).json(page);
    } catch (err) {
      console.error('Error in getPageByNumber:', err);
      next(err);
    }
  }

};

module.exports = booksController;
