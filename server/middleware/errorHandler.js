// middleware/errorHandler.js
const { AppError } = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  // Log error stack for debugging
  console.error(err.stack);

  let error = { ...err }; // Create a copy to avoid modifying the original error object
  error.message = err.message; // Ensure message is copied

  // Handle specific AppError types
  if (err instanceof AppError) {
    error.statusCode = err.statusCode;
    error.status = err.status;
    error.message = err.message;
    error.isOperational = err.isOperational;
  } else {
    // For non-AppError (programming errors), default to 500
    error.statusCode = 500;
    error.status = 'error';
    error.message = 'Something went very wrong!'; // Generic message for programming errors
    error.isOperational = false;
  }

  // Determine response based on environment
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
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
        message: 'Something went very wrong!',
      });
    }
  } else { // Default or unknown environment
      res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
      });
  }
};

module.exports = errorHandler;
