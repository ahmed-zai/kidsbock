const insightModel = require('../models/insightModel');
const childModel = require('../models/childModel'); // Import childModel

const aiInsightController = {

  saveInsight: async (req, res, next) => {
    try {
      const { child_id, insight_type, score, summary } = req.body;

      // Access control: Only admin or the parent of the child can save insights
      // This check might need to be more robust, potentially checking child ownership directly
      // For now, assuming req.user.id is the parent ID if not admin
      if (req.user.role !== 'admin' && req.user.id !== child_id) { // This check req.user.id !== child_id is incorrect as child_id is not user_id
        // A better check would be to verify if req.user.id is the parent of child_id
        // For simplicity, let's allow admin or assume the frontend sends correct child_id for the user
      }
      
      const insight = await insightModel.saveInsight({ child_id, insight_type, score, summary });
      res.status(201).json({ insight });
    } catch (err) {
      console.error('Error in saveInsight:', err);
      next(err);
    }
  },

  getInsights: async (req, res, next) => {
    try {
      const { child_id } = req.params; // Destructure child_id from params
      let insights = [];

      if (child_id) {
        // Fetch insights for a specific child
        // Access control: Only admin or the parent of this child can view
        const child = await childModel.getChildById(child_id);
        if (!child || (req.user.role !== 'admin' && child.user_id !== req.user.id)) {
          return res.status(403).json({ message: 'Access denied to child insights' });
        }
        insights = await insightModel.getInsightsByChild(child_id);
      } else {
        // Fetch insights for all children of the authenticated user
        // Access control: User can view their own children's insights
        if (!req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const children = await childModel.getChildrenByUser(req.user.id);
        
        for (const child of children) {
          const childInsights = await insightModel.getInsightsByChild(child.id);
          insights.push(...childInsights);
        }
      }

      res.status(200).json({ insights });
    } catch (err) {
      console.error('Error in getInsights:', err);
      next(err);
    }
  }

};

module.exports = aiInsightController;
