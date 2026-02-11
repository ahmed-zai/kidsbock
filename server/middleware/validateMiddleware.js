// middleware/validateMiddleware.js
const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateRegister };
