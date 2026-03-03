const pageEventModel = require('../models/pageEventModel');
const sessionModel = require('../models/sessionModel');
const childModel = require('../models/childModel');

const pageEventController = {

  addPageEvent: async (req, res, next) => {
    try {
      const { session_id, page_number, event_type, time_spent_seconds } = req.body;

      // 🔐 Verify session ownership
      const session = await sessionModel.getSessionById(session_id);
      if (!session) return res.status(404).json({ message: 'Session not found' });

      if (req.user.role !== 'admin') {
        const child = await childModel.getChildById(session.child_id);
        if (!child || child.user_id !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const event = await pageEventModel.addPageEvent({ session_id, page_number, event_type, time_spent_seconds });
      res.status(201).json({ event });
    } catch (err) {
      console.error('Error in addPageEvent:', err);
      next(err);
    }
  }

};

module.exports = pageEventController;
