// middleware/errorHandler.js
const { AppError } = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  // Log error stack for debugging
  console.error(err.stack);

  let error = { ...err };
  error.message = err.message; // Initially preserve the original message

  if (err instanceof AppError) {
    error.statusCode = err.statusCode;
    error.status = err.status;
    error.isOperational = err.isOperational;
  } else {
    // For non-AppError (programming errors), default to 500, but only set generic message conditionally
    error.statusCode = 500;
    error.status = 'error';
    error.isOperational = false;
  }

  // Determine response based on environment
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: err, // Send the original error object in dev for full details
      message: err.message, // Use the original error message
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    // Operational errors that we trust to send to client
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or other unknown errors: don't leak details
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!', // Generic message for programming errors in production
      });
    }
  } else { // Default or unknown environment (treat similar to development for programming errors)
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // For programming errors in unknown env: send full error object for debugging
      res.status(500).json({
        status: 'error',
        error: err, // Send original error object
        message: err.message, // Send original message for debugging
        stack: err.stack,
      });
    }
  }
};

module.exports = errorHandler;
