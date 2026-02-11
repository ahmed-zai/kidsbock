const eventModel = require('../models/pageEventModel');

// Track page interaction
exports.addPageEvent = async (req, res) => {
  try {
    const event = await eventModel.createPageEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
