const childModel = require('../models/childModel');

// Create child profile
exports.createChild = async (req, res) => {
  try {
    const { user_id, name, birth_date, avatar_url, reading_level } = req.body;

    const child = await childModel.createChild({
      user_id,
      name,
      birth_date,
      avatar_url,
      reading_level,
    });

    res.status(201).json(child);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all children for a parent
exports.getChildrenByUser = async (req, res) => {
  try {
    const children = await childModel.getChildrenByUser(req.params.userId);
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update child profile
exports.updateChild = async (req, res) => {
  try {
    const updated = await childModel.updateChild(req.params.childId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete child
exports.deleteChild = async (req, res) => {
  try {
    await childModel.deleteChild(req.params.childId);
    res.json({ message: 'Child deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
