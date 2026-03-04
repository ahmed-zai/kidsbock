import api from "../api/api";

const sessionService = {
  /**
   * Start a new reading session
   * @param {Object} data - { child_id, book_id, device_type }
   * @returns {Promise<Object>} Session details
   */
  startSession: async (data) => {
    try {
      const response = await api.post("/sessions", data);
      return response.data.session;
    } catch (error) {
      console.error("Error starting session:", error);
      throw error;
    }
  },

  /**
   * Log a page turn event
   * @param {Object} data - { session_id, page_number, event_type, time_spent_seconds }
   */
  logPageEvent: async (data) => {
    try {
      const response = await api.post("/page-events", data);
      return response.data.event;
    } catch (error) {
      console.error("Error logging page event:", error);
      throw error;
    }
  },

  /**
   * Log an audio interaction
   * @param {Object} data - { session_id, page_number, action }
   */
  logAudioEvent: async (data) => {
    try {
      const response = await api.post("/audio-events", data);
      return response.data.event;
    } catch (error) {
      console.error("Error logging audio event:", error);
      throw error;
    }
  },

  /**
   * End the current reading session
   * @param {string} sessionId
   * @param {Object} data - { end_time }
   */
  endSession: async (sessionId, data) => {
    try {
      const response = await api.put(`/sessions/${sessionId}`, data);
      return response.data.session;
    } catch (error) {
      console.error(`Error ending session ${sessionId}:`, error);
      throw error;
    }
  }
};

export default sessionService;
