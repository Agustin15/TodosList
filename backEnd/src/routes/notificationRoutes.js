import express from "express";
import {
  updateStateNotification,
  getNotificationsSentTasksUser,
  getNotificationsOfUserByState
} from "../controllers/notificationController.js";
export const notificationRoutes = express.Router();

notificationRoutes.get("/", getNotificationsSentTasksUser);
notificationRoutes.get("/:state", getNotificationsOfUserByState);
notificationRoutes.patch("/:id", updateStateNotification);

