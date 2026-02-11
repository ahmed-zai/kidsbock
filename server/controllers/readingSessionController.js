const sessionModel = require('../models/sessionModel');
const childModel = require('../models/childModel'); // for ownership check
const insightModel = require('../models/insightModel'); // save AI insights
const { sendSessionToAI } = require('../utils/aiService');

const readingSessionController = {

  // -----------------------------
  // START SESSION
  // -----------------------------
  startSession: async (req, res, next) => {
    try {
      const { child_id, book_id, device_type } = req.body;

      // 🔐 Verify parent owns the child
      if (req.user.role !== 'admin') {
        const child = await childModel.getChildById(child_id);
        if (!child || child.user_id !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const session = await readingSessionModel.startSession({ child_id, book_id, device_type });

      res.status(201).json({ session });

    } catch (err) {
      console.error('Error in startSession:', err);
      next(err);
    }
  },

  // -----------------------------
  // END ONE SESSION + AI ANALYSIS
  // -----------------------------
  endSession: async (req, res, next) => {
    try {
      const { session_id, end_time, total_minutes } = req.body;

      const session = await readingSessionModel.endSession({ session_id, end_time, total_minutes });
      if (!session) return res.status(404).json({ message: 'Session not found' });

      const insights = await sendSessionToAI({
        child_id: session.child_id,
        book_id: session.book_id,
        total_minutes: session.total_minutes,
        page_events: session.page_events,
        audio_events: session.audio_events,
      });

      // 💾 Save AI insights
      await insightModel.saveInsights(session.child_id, insights);

      res.status(200).json({ session, insights });

    } catch (err) {
      console.error('Error in endSession:', err);
      next(err);
    }
  },

  // -----------------------------
  // END MULTIPLE SESSIONS (BATCH AI)
  // -----------------------------
  endMultipleSessions: async (req, res, next) => {
    try {
      const { sessions } = req.body;

      if (!Array.isArray(sessions) || sessions.length === 0) {
        return res.status(400).json({ message: 'Sessions array is required' });
      }

      const results = [];

      for (const s of sessions) {
        const session = await readingSessionModel.endSession(s);
        if (!session) continue;

        const insights = await sendSessionToAI({
          child_id: session.child_id,
          book_id: session.book_id,
          total_minutes: session.total_minutes,
          page_events: session.page_events,
          audio_events: session.audio_events,
        });

        // 💾 Save insights for each session
        await insightModel.saveInsights(session.child_id, insights);

        results.push({ session, insights });
      }

      res.status(200).json({
        processed: results.length,
        results,
      });

    } catch (err) {
      console.error('Error in endMultipleSessions:', err);
      next(err);
    }
  }

};

module.exports = readingSessionController;
