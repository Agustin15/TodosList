import { Notification } from "../model/notificationModel.js";
import { NotificationToQueue } from "./notificationsQueue.js";
import { ScheduledJobService } from "./scheduledJobService.js";

const notificationModel = new Notification();

export const NotificationService = {
  addNotification: async (subscriptions, task, idUser) => {
    try {
      let notificationAdded = await notificationModel.addNotification(
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

      await NotificationService.addNotificationsSubscriptions(
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

  addNotificationsSubscriptions: async (idNotification, subscriptions) => {
    let errorAdd = false;
    try {
      for (const subscription of subscriptions) {
        let notificationSubscriptionAdded =
          await notificationModel.addNotificationSubscription(
            idNotification,
            subscription.endpointURL
          );

        if (notificationSubscriptionAdded == 0) {
          errorAdd = true;
          break;
        }
      }

      if (errorAdd)
        throw new Error("Failed to add notification of subscription");
    } catch (error) {
      throw error;
    }
  },
  getNotificationSubscriptionByIdNotification: async (idNotification) => {
    try {
      let notification =
        await notificationModel.getNotificationSubscriptionByIdNotifi(
          idNotification
        );

      return notification;
    } catch (error) {
      throw new Error(error);
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

  updateNotification: async (idNotification, newDatetime) => {
    try {
      let notificationUpdated =
        await notificationModel.updateDatetimeNotification(
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

  updateStateNotification: async (idTask, newState) => {
    try {
      let notification = await NotificationService.findNotificationByIdTask(
        idTask
      );
      let notificationUpdated = await notificationModel.updateStateNotification(
        notification[0].idNotification,
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
      let deleted = await notificationModel.deleteNotification(idNotification);
      await NotificationToQueue.deleteNotificationFromQueue(
        `'${jobNotificationFound.idJob}'`
      );

      return deleted;
    } catch (error) {
      throw error;
    }
  }
};
