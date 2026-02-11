const insightModel = require('../models/insightModel');

// Save AI-generated insight
exports.saveInsight = async (req, res) => {
  try {
    const insight = await insightModel.createInsight(req.body);
    res.status(201).json(insight);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get insights for a child
exports.getChildInsights = async (req, res) => {
  try {
    const insights = await insightModel.getInsightsByChild(req.params.childId);
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
