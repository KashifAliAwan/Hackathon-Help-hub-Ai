import asyncHandler from "../utils/asyncHandler.js";
import Notification from "../models/notification.model.js";
import { serializeNotification } from "../utils/community.utils.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    notifications: notifications.map((notification) =>
      serializeNotification(notification),
    ),
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  notification.read = true;
  await notification.save({ validateModifiedOnly: true });

  return res.status(200).json({
    success: true,
    message: "Notification marked as read.",
    notification: serializeNotification(notification),
  });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });

  const notifications = await Notification.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read.",
    notifications: notifications.map((notification) =>
      serializeNotification(notification),
    ),
  });
});
