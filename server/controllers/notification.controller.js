const notificationModel = require('../models/notification.model');
const { handleError, sendSuccessResponse } = require('../utils/responseUtils');
exports.getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationModel
            .find({ recipient: req.userID })
            .sort({ createdAt: -1 })
            .populate({ path: 'productId', select: 'name' })
            .populate({ path: 'recipient', select: 'name email role' });
        sendSuccessResponse(res, 'Notifications retrieved successfully', { notifications });
    } catch (error) {
        handleError(
            next,
            `Failed to retrieve notifications. ${error.message}`,
            500,
            error.message
        );
    }
};

exports.markNotificationAsRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const notification = await notificationModel.findById(notificationId);
        if (!notification) {
            return handleError(next, 'Notification not found.', 404);
        }
        if (notification.recipient.toString() !== req.userID) {
           return handleError(next, 'Unauthorized', 403);
        }
        notification.status = 'sent';
        notification.sentAt = new Date();

        await notification.save();
        sendSuccessResponse(res, 'Notification marked as read', {
          notification: { ...notification._doc, status: 'sent' },
        });
    } catch (error) {
        handleError(
            next,
            `Failed to mark notification as read. ${error.message}`,
            500,
            error.message
        );
    }
};


exports.markAllNotificationAsRead = async (req, res, next) => {
     try {
        const userId = req.userID;
        const result = await notificationModel.updateMany(
             { recipient: userId, status: 'pending' },
              { status: 'sent', sentAt: new Date() }
          );
        if (result.modifiedCount === 0) {
           return handleError(next, 'No unread notifications found for this user', 404);
        }

        sendSuccessResponse(
            res,
            `Marked ${result.modifiedCount} notifications as sent`,
            {
                 modifiedCount : result.modifiedCount,
                status : 'sent',
            }
        );
     } catch (error) {
           handleError(
               next,
               `Failed to mark all notification as read. ${error.message}`,
               500,
               error.message
           );
       }
};


exports.clearNotifications = async (req, res, next) => {
     try {
        const userId = req.userID;
        const result = await notificationModel.deleteMany(
             { recipient: userId }
          );
        if (result.deletedCount === 0) {
            return handleError(next, 'No notifications found for this user', 404);
        }
        sendSuccessResponse(
            res,
           `Deleted ${result.deletedCount} notifications for this user`,
            {
              deletedCount: result.deletedCount,
            }
         );
     } catch (error) {
           handleError(
               next,
               `Failed to delete notifications. ${error.message}`,
               500,
               error.message
           );
       }
};