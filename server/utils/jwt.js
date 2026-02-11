const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a JWT token
 * @param {string} userId - The user ID
 * @param {string} role - The role of the user
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d', // token valid for 7 days
  });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
