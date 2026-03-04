import api from "../api/api";

const childService = {
  /**
   * Fetch all children for the current user
   * @returns {Promise<Array>} List of children
   */
  getChildren: async () => {
    try {
      const response = await api.get("/children");
      return response.data.children || [];
    } catch (error) {
      console.error("Error fetching children:", error);
      throw error;
    }
  },

  /**
   * Fetch a single child's details by ID
   * @param {string} id - The child ID
   * @returns {Promise<Object>} Child details
   */
  getChildById: async (id) => {
    try {
      const response = await api.get(`/children/${id}`);
      return response.data.child || null;
    } catch (error) {
      console.error(`Error fetching child with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Register a new child profile
   * @param {Object} data - { name, birth_date, avatar_url, reading_level }
   * @returns {Promise<Object>} The created child profile
   */
  createChild: async (data) => {
    try {
      const response = await api.post("/children", data);
      return response.data.child;
    } catch (error) {
      console.error("Error creating child:", error);
      throw error;
    }
  }
};

export default childService;
