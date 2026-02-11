const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt'); // your JWT helper

const SALT_ROUNDS = 10;

const userController = {

  // -----------------------------
  // REGISTER USER
  // -----------------------------
  registerUser: async (req, res, next) => {
    try {
      const { full_name, email, password } = req.body;

      // Check if user exists
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await userModel.createUser({ full_name, email, password_hash });

      // Generate JWT token
      const token = jwt.generateToken({ id: user.id, email: user.email, role: user.role });

      res.status(201).json({ user, token });
    } catch (err) {
      console.error('Error in registerUser:', err);
      next(err);
    }
  },

  // -----------------------------
  // LOGIN USER
  // -----------------------------
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

      const token = jwt.generateToken({ id: user.id, email: user.email, role: user.role });

      res.status(200).json({ user, token });
    } catch (err) {
      console.error('Error in loginUser:', err);
      next(err);
    }
  },

  // -----------------------------
  // GET USER PROFILE
  // -----------------------------
  getUserProfile: async (req, res, next) => {
    try {
      const userId = req.params.id;

      // Ensure user can only access their own profile unless admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await userModel.getUserById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.status(200).json({ user });
    } catch (err) {
      console.error('Error in getUserProfile:', err);
      next(err);
    }
  },

  // -----------------------------
  // UPDATE USER PLAN
  // -----------------------------
  updatePlan: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const { plan_type } = req.body;

      // Only admin or user themselves can update
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const updatedUser = await userModel.updateUserPlan(userId, plan_type);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });

      res.status(200).json({ user: updatedUser });
    } catch (err) {
      console.error('Error in updatePlan:', err);
      next(err);
    }
  }

};

module.exports = userController;
