const progressModel = require('../models/progressModel');
const childModel = require('../models/childModel');

const readingProgressController = {

  updateProgress: async (req, res, next) => {
    try {
      const { child_id, book_id, last_page_read, progress_percent, completed } = req.body;

      // 🔐 Verify parent owns the child
      if (req.user.role !== 'admin') {
        const child = await childModel.getChildById(child_id);
        if (!child || child.user_id !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
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
      
      // 🔐 Verify parent owns the child
      if (req.user.role !== 'admin') {
        const child = await childModel.getChildById(child_id);
        if (!child || child.user_id !== req.user.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const progress = await readingProgressModel.getProgressByChild(child_id);
      res.status(200).json({ progress });
    } catch (err) {
      console.error('Error in getProgressByChild:', err);
      next(err);
    }
  }

};

module.exports = readingProgressController;
