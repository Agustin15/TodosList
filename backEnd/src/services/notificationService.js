import { Notification } from "../model/notificationModel.js";
import { SubscriptionNotificationService } from "./subscriptionNotificationService.js";
import { NotificationToQueue } from "./notificationsQueue.js";
import { ScheduledJobService } from "./scheduledJobService.js";

const notificationModel = new Notification();

export const NotificationService = {
  addNotification: async (subscriptions, task, idUser) => {
    try {
      notificationModel.propTask = task;
      notificationModel.propDatetimeSend = task.datetimeNotification;
      notificationModel.propState = "pending";
      let notificationAdded = await notificationModel.post();

      if (notificationAdded == 0) throw new Error("Failed to add notification");

      let notificationFound =
        await NotificationService.findNotificationByIdTask(task);

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
        notificationFound[0],
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
  findNotificationByIdTask: async (task) => {
    try {
      notificationModel.propTask = task;
      let notification = await notificationModel.getNotificationByIdTask();

      return notification;
    } catch (error) {
      throw new Error(error);
    }
  },

  findNotificationsSentTasksUser: async (task) => {
    try {
      notificationModel.propTask = task;
      notificationModel.propState = "pending";

      let notifications =
        await notificationModel.getNotificationsSentTasksUser();

      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  },

  findNotificationsOfUserByState: async (state, idUser) => {
    try {
      notificationModel.propTask = { idUser: idUser };
      notificationModel.propState = state;

      let notifications =
        await notificationModel.getNotificationsOfUserByState();

      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateNotification: async (idNotification, newDatetime) => {
    try {
      notificationModel.propIdNotification = idNotification;
      notificationModel.propDatetimeSend = newDatetime;

      let notificationUpdated =
        await notificationModel.patchDatetimeNotification();

      if (notificationUpdated == 0)
        throw new Error("Failed to update notification");

      return notificationUpdated;
    } catch (error) {
      throw error;
    }
  },

  updateStateNotification: async (id, newState) => {
    try {
      notificationModel.propState = newState;
      notificationModel.propIdNotification = id;

      let notificationUpdated =
        await notificationModel.patchStateNotification();

      if (notificationUpdated == 0)
        throw new Error("Failed to update state notification");
      return notificationUpdated;
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (idNotification) => {
    try {
      notificationModel.propIdNotification = idNotification;

      let jobNotificationFound =
        await ScheduledJobService.getJobByIdNotification(idNotification);

      let deleted = await notificationModel.delete();

      await NotificationToQueue.deleteNotificationFromQueue(
        `'${jobNotificationFound.idJob}'`
      );

      return deleted;
    } catch (error) {
      throw error;
    }
  }
};
