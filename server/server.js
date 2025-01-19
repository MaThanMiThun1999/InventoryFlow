require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('./middlewares/loggingMiddleware');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const {
  VERSION,
  PORT,
  NODE_ENV,
  CLIENT_URL,
  APP_NAME,
  CRON_SEND_SEND_EMAIL,
} = require('./config/envConfig');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const employeeRoutes = require('./routes/employee.routes');
const notificationRoutes = require('./routes/notification.routes');
const {
  checkAndSendLowStockAlerts,
} = require('./controllers/product.controller');

const app = express();

connectDB()
  .then(() => {
    logger.info('Database connected successfully'.green.bold);
  })
  .catch((error) => {
    logger.error('Database connection failed'.red.bold, error.message);
    process.exit(1);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan);

app.use(
  cors({
    origin: NODE_ENV === 'production' ? CLIENT_URL : 'http://localhost:8000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

logger.info('Middlewares loaded successfully'.green.bold);

// Routes
app.get('/', (req, res) => {
  res.send({
    success: true,
    message: `Welcome to ${APP_NAME}'s API`,
  });
});

// Schedule job to run at when call this api
app.get('/send', async (req, res) => {
  await checkAndSendLowStockAlerts();
  res.send({
    success: true,
    message: 'Low stock alerts sent successfully',
  });
});
// API Routes
app.use(`/api/${VERSION}/auth`, authRoutes);
app.use(`/api/${VERSION}/products`, productRoutes);
app.use(`/api/${VERSION}/employees`, employeeRoutes);
app.use(`/api/${VERSION}/notifications`, notificationRoutes);

logger.info('Routes registered successfully'.green.bold);

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

const server = app.listen(PORT, () => {
  logger.info(
    `Server running in ${NODE_ENV} mode on http://localhost:${PORT}`.yellow.bold
  );
});
// Schedule job to run at 10:00 AM IST daily
console.log(CRON_SEND_SEND_EMAIL);
cron.schedule(
  CRON_SEND_SEND_EMAIL,
  async () => {
    await checkAndSendLowStockAlerts();
    logger.info(
      'Low stock alerts sent successfully at 10:00 AM IST'.green.bold
    );
  },
  {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  }
);

const shutdown = () => {
  logger.info('Gracefully shutting down...'.red.bold);
  server.close(() => {
    logger.info('Closed out remaining connections.'.red.bold);
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcefully shutting down due to timeout.'.red.bold);
    process.exit(1);
  }, 60000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
