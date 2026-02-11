const insightModel = require('../models/insightModel');

const insightController = {

  saveInsight: async (req, res, next) => {
    try {
      const { child_id, insight_type, score, summary } = req.body;

      if (req.user.role !== 'admin' && req.user.id !== child_id) return res.status(403).json({ message: 'Access denied' });

      const insight = await insightModel.saveInsight({ child_id, insight_type, score, summary });
      res.status(201).json({ insight });
    } catch (err) {
      console.error('Error in saveInsight:', err);
      next(err);
    }
  },

  getInsightsByChild: async (req, res, next) => {
    try {
      const child_id = req.params.child_id;
      if (req.user.role !== 'admin' && req.user.id !== child_id) return res.status(403).json({ message: 'Access denied' });

      const insights = await insightModel.getInsightsByChild(child_id);
      res.status(200).json({ insights });
    } catch (err) {
      console.error('Error in getInsightsByChild:', err);
      next(err);
    }
  }

};

module.exports = insightController;
