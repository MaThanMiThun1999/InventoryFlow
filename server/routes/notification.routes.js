const express = require('express');
const {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationAsRead,
  clearNotifications,
} = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllNotifications);
router.put('/:id', markNotificationAsRead);
router.put('/', markAllNotificationAsRead);
router.delete('/', clearNotifications);

module.exports = router;
