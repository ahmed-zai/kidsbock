const readingProgressModel = require('../models/readingProgressModel');

const readingProgressController = {

  updateProgress: async (req, res, next) => {
    try {
      const { child_id, book_id, last_page_read, progress_percent, completed } = req.body;

      // Ensure user owns the child
      if (req.user.role !== 'admin' && req.user.id !== child_id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const progress = await readingProgressModel.updateProgress({ child_id, book_id, last_page_read, progress_percent, completed });
      res.status(200).json({ progress });
    } catch (err) {
      console.error('Error in updateProgress:', err);
      next(err);
    }
  },

  getProgressByChild: async (req, res, next) => {
    try {
      const child_id = req.params.child_id;
      if (req.user.role !== 'admin' && req.user.id !== child_id) return res.status(403).json({ message: 'Access denied' });

      const progress = await readingProgressModel.getProgressByChild(child_id);
      res.status(200).json({ progress });
    } catch (err) {
      console.error('Error in getProgressByChild:', err);
      next(err);
    }
  }

};

module.exports = readingProgressController;
