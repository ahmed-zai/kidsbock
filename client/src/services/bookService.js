import api from "../api/api";

const bookService = {
  /**
   * Fetch all books
   * @returns {Promise<Array>} List of books
   */
  getBooks: async () => {
    try {
      const response = await api.get("/books");
      return response.data.books || [];
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  /**
   * Fetch a single book by ID
   * @param {string} id - The book ID
   * @returns {Promise<Object>} The book details
   */
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data.book || null;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  }
};

export default bookService;
