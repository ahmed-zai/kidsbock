const audioModel = require('../models/audioEventModel');

exports.addAudioEvent = async (req, res) => {
  try {
    const event = await audioModel.createAudioEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
