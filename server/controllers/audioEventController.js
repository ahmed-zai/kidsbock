const audioEventModel = require('../models/audioEventModel');

const audioEventController = {

  addAudioEvent: async (req, res, next) => {
    try {
      const { session_id, page_number, action } = req.body;
      const event = await audioEventModel.addAudioEvent({ session_id, page_number, action });
      res.status(201).json({ event });
    } catch (err) {
      console.error('Error in addAudioEvent:', err);
      next(err);
    }
  }

};

module.exports = audioEventController;
