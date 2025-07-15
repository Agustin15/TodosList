import { Notification } from "../model/notificationModel.js";
import { SubscriptionNotificationService } from "./subscriptionNotificationService.js";
import { NotificationToQueue } from "./notificationsQueue.js";
import { ScheduledJobService } from "./scheduledJobService.js";
import { socketConnection } from "../app.js";

const notificationModel = new Notification();

export const NotificationService = {
  addNotification: async (subscriptions, task, idUser) => {
    try {
      if (
        new Date(task.datetimeNotification).getTime() >=
        new Date(task.datetimeTask).getTime()
      )
        throw new Error(
          "Datetime notification must be less or same that datetime task"
        );

      notificationModel.propIdTask = task.idTask;
      notificationModel.propDatetimeSend = task.datetimeNotification;
      notificationModel.propState = "pending";
      let notificationAdded = await notificationModel.post();
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
      notificationModel.propIdTask = idTask;
      let notification = await notificationModel.getNotificationByIdTask();

      return notification;
    } catch (error) {
      throw new Error(error);
    }
  },

  findNotificationsSentTasksUser: async (idUser) => {
    try {
      notificationModel.propState = "pending";

      let notifications = await notificationModel.getNotificationsSentTasksUser(
        idUser
      );

      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  },

  findNotificationsOfUserByState: async (state, idUser) => {
    try {
      notificationModel.propState = state;

      let notifications = await notificationModel.getNotificationsOfUserByState(
        idUser
      );

      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  },

  updateNotification: async (idNotification, newDatetime) => {
    try {
      notificationModel.propIdNotification = idNotification;
      notificationModel.propDatetimeSend = new Date(newDatetime);

      let notificationUpdated =
        await notificationModel.patchDatetimeNotification();

      if (notificationUpdated == 0)
        throw new Error("Failed to update notification");

      return notificationUpdated;
    } catch (error) {
      throw error;
    }
  },

  updateStateNotification: async (id, newState, idUser) => {
    try {
      notificationModel.propState = newState;
      notificationModel.propIdNotification = id;

      let notificationUpdated =
        await notificationModel.patchStateNotification();

      if (notificationUpdated == 0)
        throw new Error("Failed to update state notification");

      if (newState == "seen") {
        let notificationsNotSeen =
          await NotificationService.findNotificationsOfUserByState(
            "sent",
            idUser
          );

        socketConnection.socket.emit(
          "newNotificationsNotSeen",
          notificationsNotSeen
        );
      }

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
