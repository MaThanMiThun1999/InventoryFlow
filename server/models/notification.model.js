// models/notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'pending'],
      default: 'pending',
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model('Notification', notificationSchema);

module.exports = notificationModel;
