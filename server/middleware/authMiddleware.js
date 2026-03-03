const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth Middleware: Token present:', !!token);

      // Verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth Middleware: Token decoded:', decoded);
        // Get user from the token
        req.user = await userModel.getUserById(decoded.id);
        console.log('Auth Middleware: User from DB:', req.user ? 'Found' : 'Not Found');
      } catch (error) {
        console.error('Auth Middleware: Token verification failed:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
        return;
      }


      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
