const readingSessionModel = require('../models/readingSessionModel');

const readingSessionController = {

  startSession: async (req, res, next) => {
    try {
      const { child_id, book_id, device_type } = req.body;

      if (req.user.role !== 'admin' && req.user.id !== child_id) return res.status(403).json({ message: 'Access denied' });

      const session = await readingSessionModel.startSession({ child_id, book_id, device_type });
      res.status(201).json({ session });
    } catch (err) {
      console.error('Error in startSession:', err);
      next(err);
    }
  },

  endSession: async (req, res, next) => {
    try {
      const { session_id, end_time, total_minutes } = req.body;
      const session = await readingSessionModel.endSession({ session_id, end_time, total_minutes });
      res.status(200).json({ session });
    } catch (err) {
      console.error('Error in endSession:', err);
      next(err);
    }
  }

};

module.exports = readingSessionController;
