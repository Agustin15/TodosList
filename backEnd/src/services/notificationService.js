import { Notification } from "../model/notificationModel.js";
import { SubscriptionNotificationService } from "./subscriptionNotificationService.js";
import { NotificationToQueue } from "./notificationsQueue.js";
import { ScheduledJobService } from "./scheduledJobService.js";

const notificationModel = new Notification();

export const NotificationService = {
  addNotification: async (subscriptions, task, idUser) => {
    try {
      let notificationAdded = await notificationModel.post(
        task.idTask,
        task.datetimeNotification,
        "pending"
      );

      if (notificationAdded == 0) throw new Error("Failed to add notification");

      let notificationFound =
        await NotificationService.findNotificationByIdTask(task.idTask);

      if (notificationFound.length == 0) {
        throw new Error("Notification not found");
      }
      await ScheduledJobService.addJob(notificationFound[0].idNotification);

      let jobNotificationFound =
        await ScheduledJobService.getJobByIdNotification(
          notificationFound[0].idNotification
        );

      let idJob = `'${jobNotificationFound.idJob}'`;

      await SubscriptionNotificationService.addNotificationsSubscriptions(
        notificationFound[0].idNotification,
        subscriptions
      );

      await NotificationToQueue.scheduleNotificationToQueue(
        idUser,
        task,
        idJob
      );
    } catch (error) {
      throw error;
    }
  },
  findNotificationByIdTask: async (idTask) => {
    try {
      let notification = await notificationModel.getNotificationByIdTask(
        idTask
      );
      return notification;
    } catch (error) {
      throw new Error(error);
    }
  },

  findNotificationsSentTasksUser: async (idUser) => {
    try {
      let notifications = await notificationModel.getNotificationsSentTasksUser(
        idUser,
        "pending"
      );

      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  },
  updateNotification: async (idNotification, newDatetime) => {
    try {
      let notificationUpdated =
        await notificationModel.patchDatetimeNotification(
          idNotification,
          newDatetime
        );

      if (notificationUpdated == 0)
        throw new Error("Failed to update notification");

      return notificationUpdated;
    } catch (error) {
      throw error;
    }
  },

  updateStateNotification: async (id, newState, option) => {
    let idNotification;
    try {
      if (option == "notificationSent") {
        let notification = await NotificationService.findNotificationByIdTask(
          id
        );
        idNotification = notification[0].idNotification;
      } else {
        idNotification = id;
      }

      let notificationUpdated = await notificationModel.patchStateNotification(
        idNotification,
        newState
      );

      if (notificationUpdated == 0)
        throw new Error("Failed to update state notification");
      return notificationUpdated;
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (idNotification) => {
    try {
      let jobNotificationFound =
        await ScheduledJobService.getJobByIdNotification(idNotification);
      let deleted = await notificationModel.delete(idNotification);
      await NotificationToQueue.deleteNotificationFromQueue(
        `'${jobNotificationFound.idJob}'`
      );

      return deleted;
    } catch (error) {
      throw error;
    }
  }
};
