import express from "express";
import {
  updateStateNotification,
  getNotificationsSentTasksUser
} from "../controllers/notificationController.js";
export const notificationRoutes = express.Router();

notificationRoutes.get("/", getNotificationsSentTasksUser);
notificationRoutes.patch("/:id", updateStateNotification);

