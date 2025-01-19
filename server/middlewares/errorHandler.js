// middlewares/errorHandler.js
const logger = require('../config/logger');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // Set error message and statusCode
  error.message = err.message || 'Server Error';
  error.statusCode = err.statusCode || 500;
  if (err.logMessage) {
    logger.error(error.message, { stack: err.logMessage, req: req });
  } else {
    logger.error(error.message, { stack: err.stack, req: req });
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace only in development
  });
};

module.exports = errorHandler;
