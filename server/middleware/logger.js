// middleware/logger.js
const morgan = require('morgan');

const logger = morgan('dev'); // dev-friendly logging

module.exports = logger;
