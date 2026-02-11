const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');


// ==============================
// REGISTER USER
// ==============================
exports.registerUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const newUser = await userModel.createUser({
      full_name,
      email,
      password_hash,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ==============================
// LOGIN USER
// ==============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        plan_type: user.plan_type,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ==============================
// GET USER PROFILE
// ==============================
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ==============================
// UPDATE USER PLAN (FREE → PREMIUM)
// ==============================
exports.updatePlan = async (req, res) => {
  try {
    const userId = req.params.id;
    const { plan_type } = req.body; // 'free' or 'premium'

    if (!['free', 'premium'].includes(plan_type)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const updatedUser = await userModel.updateUserPlan(userId, plan_type);

    res.json({
      message: 'Plan updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Plan Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ==============================
// DELETE USER (ADMIN FEATURE)
// ==============================
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await userModel.deleteUser(userId); // make sure this exists in model

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
