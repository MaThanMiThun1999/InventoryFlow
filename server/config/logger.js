// config/logger.js
const winston = require('winston');

// Log formats: Define custom formats for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
  winston.format.errors({ stack: true }), // Include stack trace for errors
  winston.format.colorize(), // Add colors for console logs
  winston.format.printf(({ timestamp, level, message, stack, req }) => {
    let logMessage = `${timestamp} [${level.bold}]: ${message}`;
    if (stack) logMessage += ` - ${stack}`;

    if (req) {
      logMessage += `\n Request: ${req.method} ${req.url},`;
      logMessage += `\n Headers: ${JSON.stringify(req.headers)}`;
      logMessage += `\n Body: ${JSON.stringify(req.body)}`;
      logMessage += `\n Params: ${JSON.stringify(req.params)}`;
      logMessage += `\n Query: ${JSON.stringify(req.query)}`;
    }
    return logMessage;
  })
);

// Transport for console logging (for development purposes)
const consoleTransport = new winston.transports.Console({
  level: 'debug', // Log everything (debug and above)
  format: winston.format.combine(
    winston.format.colorize(), // Colorize the logs in the console
    logFormat // Apply log format
  ),
});

// Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level (logs everything 'info' and above)
  format: logFormat, // Use the custom format
  transports: [
    consoleTransport, // Output to the console
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1); // Exit process if there's an uncaught exception
});

// Export the logger instance
module.exports = logger;
