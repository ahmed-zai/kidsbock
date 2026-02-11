const childModel = require('../models/childModel');

const childController = {

  createChild: async (req, res, next) => {
    try {
      const { name, birth_date, avatar_url, reading_level } = req.body;
      const user_id = req.user.id;

      const child = await childModel.createChild({ user_id, name, birth_date, avatar_url, reading_level });
      res.status(201).json({ child });
    } catch (err) {
      console.error('Error in createChild:', err);
      next(err);
    }
  },

  getChildren: async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const children = await childModel.getChildrenByUser(user_id);
      res.status(200).json({ children });
    } catch (err) {
      console.error('Error in getChildren:', err);
      next(err);
    }
  },

  getChildById: async (req, res, next) => {
    try {
      const child = await childModel.getChildById(req.params.id);
      if (!child) return res.status(404).json({ message: 'Child not found' });
      if (child.user_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
      res.status(200).json({ child });
    } catch (err) {
      console.error('Error in getChildById:', err);
      next(err);
    }
  },

  updateChild: async (req, res, next) => {
    try {
      const updatedChild = await childModel.updateChild(req.params.id, req.body);
      if (!updatedChild) return res.status(404).json({ message: 'Child not found or nothing to update' });
      res.status(200).json({ child: updatedChild });
    } catch (err) {
      console.error('Error in updateChild:', err);
      next(err);
    }
  },

  deleteChild: async (req, res, next) => {
    try {
      const deletedChild = await childModel.deleteChild(req.params.id);
      if (!deletedChild) return res.status(404).json({ message: 'Child not found' });
      res.status(200).json({ message: 'Child deleted', id: deletedChild.id });
    } catch (err) {
      console.error('Error in deleteChild:', err);
      next(err);
    }
  }

};

module.exports = childController;
