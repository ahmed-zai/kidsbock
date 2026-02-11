const progressModel = require('../models/readingProgressModel');

// Save or update reading progress
exports.updateProgress = async (req, res) => {
  try {
    const { child_id, book_id, last_page_read, progress_percent, completed } = req.body;

    const progress = await progressModel.upsertProgress({
      child_id,
      book_id,
      last_page_read,
      progress_percent,
      completed,
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get child progress
exports.getChildProgress = async (req, res) => {
  try {
    const progress = await progressModel.getProgressByChild(req.params.childId);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
