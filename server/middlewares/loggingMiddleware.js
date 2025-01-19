// middlewares/loggingMiddleware.js
const morgan = require('morgan');
const logger = require('../config/logger'); // Winston for logging

const requestLogger = (tokens, req, res) => {
  logger.info(
    `Incoming request: ${tokens.method(req, res)} ${tokens.url(
      req,
      res
    )}, ${tokens.status(req, res)} ${tokens.res(
      req,
      res,
      'content-length'
    )} - ${tokens['response-time'](req, res)}ms`,
    { req }
  );
};
module.exports = morgan(requestLogger);
