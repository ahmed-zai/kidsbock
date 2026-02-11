const sessionModel = require('../models/readingSessionModel');

// Start reading session
exports.startSession = async (req, res) => {
  try {
    const { child_id, book_id, device_type } = req.body;
    const session = await sessionModel.createSession({ child_id, book_id, device_type });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// End session
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { total_minutes } = req.body;

    const session = await sessionModel.endSession(sessionId, total_minutes);
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
