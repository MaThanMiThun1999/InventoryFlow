// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./config/logger'); // Custom Winston logger
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('./middlewares/loggingMiddleware'); // Morgan for HTTP logging
const cookieParser = require('cookie-parser');
const {
  VERSION,
  PORT,
  NODE_ENV,
  CLIENT_URL,
  APP_NAME,
} = require('./config/envConfig'); // Include NODE_ENV for environment logging
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const employeeRoutes = require('./routes/employee.routes');
const notificationRoutes = require('./routes/notification.routes');
const {
  checkAndSendLowStockAlerts,
} = require('./controllers/product.controller');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB()
  .then(() => {
    logger.info('Database connected successfully'.green.bold);
  })
  .catch((error) => {
    logger.error('Database connection failed'.red.bold, error.message);
    process.exit(1); // Exit process on DB connection failure
  });

// Middlewares
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cookieParser());
app.use(morgan);

app.use(
  cors({
    origin: NODE_ENV === 'production' ? CLIENT_URL : 'http://localhost:8000', // Allow specific origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);

// Log that the middlewares have been successfully loaded
logger.info('Middlewares loaded successfully'.green.bold);

// Routes
app.get('/', (req, res) => {
  res.send({
    success: true,
    message: `Welcome to ${APP_NAME}'s API`,
  });
});

//API Routes
app.use(`/api/${VERSION}/auth`, authRoutes);
app.use(`/api/${VERSION}/products`, productRoutes);
app.use(`/api/${VERSION}/employees`, employeeRoutes);
app.use(`/api/${VERSION}/notifications`, notificationRoutes);

// Log that the routes have been registered
logger.info('Routes registered successfully'.green.bold);

// Error handling middleware (should be after all routes)
app.use(errorHandler);
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('CORS Headers:', res.getHeaders());
  });
  next();
});

app.use((req, res, next) => {
  console.log('Incoming request:', req.headers);
  next();
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(
    `Server running in ${NODE_ENV} mode on http://localhost:${PORT}`.yellow.bold
  );
});

// Schedule the low stock alerts job to run every 1 hour
const lowStockInterval = 60 * 60 * 1000; // 1 hour in milliseconds

setInterval(async () => {
  await checkAndSendLowStockAlerts();
}, lowStockInterval);

// Graceful shutdown for SIGINT and SIGTERM
const shutdown = () => {
  logger.info('Gracefully shutting down...'.red.bold);
  server.close(() => {
    logger.info('Closed out remaining connections.'.red.bold);
    process.exit(0); // Exit when all connections are closed
  });

  // Force exit if it takes too long
  setTimeout(() => {
    logger.error('Forcefully shutting down due to timeout.'.red.bold);
    process.exit(1);
  }, 60000); // 60 seconds timeout
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
