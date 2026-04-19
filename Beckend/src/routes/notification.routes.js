import express from "express";
import verifyAuthentication from "../middlewares/verifyAuth.js";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controller/notification.controller.js";

const router = express.Router();

router.use(verifyAuthentication);

router.get("/", listNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

export default router;
