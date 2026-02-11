const pageEventModel = require('../models/pageEventModel');

const pageEventController = {

  addPageEvent: async (req, res, next) => {
    try {
      const { session_id, page_number, event_type, time_spent_seconds } = req.body;
      const event = await pageEventModel.addPageEvent({ session_id, page_number, event_type, time_spent_seconds });
      res.status(201).json({ event });
    } catch (err) {
      console.error('Error in addPageEvent:', err);
      next(err);
    }
  }

};

module.exports = pageEventController;
