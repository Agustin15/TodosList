import { Worker } from "bullmq";
import webpush from "web-push";
import { SubscriptionPushService } from "./subscriptionPushService.js";
import { NotificationService } from "./notificationService.js";
import { ScheduledJobService } from "./scheduledJobService.js";
import { socketConnection } from "../app.js";
import { redisConnection } from "../config/connectionRedis.js";

export const NotificationToQueue = {
  deleteNotificationFromQueue: async (idJob) => {
    try {
      let jobFound = await redisConnection.propNotificationQueue.getJob(idJob);

      if (jobFound) {
        await jobFound.remove();
      }
    } catch (error) {
      throw new Error(error);
    }
  },

  scheduleNotificationToQueue: async (idUser, task, idJob) => {
    try {
      const payload = {
        idTask: task.idTask,
        iconTask: task.icon,
        descriptionTask: task.descriptionTask,
        datetimeTask: task.datetimeTask,
        datetimeNotification: task.datetimeNotification
      };

      let delay = new Date(task.datetimeNotification).getTime() - Date.now();

      let notificationQueueAdded =
        await redisConnection.propNotificationQueue.add(
          "sendNotification",
          { idUser: idUser, payload: payload },
          { jobId: idJob, delay: delay }
        );

      if (!notificationQueueAdded)
        throw new Error("Failed to add job to queue", { cause: { code: 500 } });
    } catch (error) {
      throw error;
    }
  },

  workerNotificationQueue: async () => {
    let sent = false;
    let myWorker;

    try {
      myWorker = new Worker(
        "notifications",
        async (job) => {
          const task = job.data.payload;
          const payloadNotification = Buffer.from(
            JSON.stringify(job.data.payload)
          );
          const idUser = job.data.idUser;

          if (!process.env.VAPID_PUBLIC_KEY)
            throw new Error("Vapid private key not declared", {
              cause: { code: 500 }
            });
          if (!process.env.VAPID_PRIVATE_KEY)
            throw new Error("Vapid public key not declared", {
              cause: { code: 500 }
            });
          if (!process.env.MAILTO_EMAIL_NOTFICATION_SERVER)
            throw new Error("Mailto email not declared", {
              cause: { code: 500 }
            });

          let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
          let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
          let mailtoEmail = process.env.MAILTO_EMAIL_NOTFICATION_SERVER;

          webpush.setVapidDetails(mailtoEmail, vapidPublicKey, vapidPrivateKey);

          let userSubscriptions =
            await SubscriptionPushService.getSubscriptionsByIdUser(idUser);

          if (userSubscriptions.length == 0)
            throw new Error("Error, subscriptions not found", {
              cause: { code: 404 }
            });

          for (let f = 0; f < userSubscriptions.length; f++) {
            const subscription = {
              endpoint: userSubscriptions[f].endpointURL,
              keys: {
                auth: userSubscriptions[f].auth,
                p256dh: userSubscriptions[f].p256dh
              }
            };
            let notificationSent = await webpush.sendNotification(
              subscription,
              payloadNotification
            );

            if (notificationSent.statusCode == 201) {
              sent = true;
            }
          }
          if (sent) {
            let notificationFound =
              await NotificationService.findNotificationByIdTask(task.idTask);

            if (notificationFound.length == 0) {
              throw new Error("task notification not found",{ cause: { code: 404 } });
            }

            await NotificationService.updateStateNotification(
              notificationFound[0].idNotification,
              "sent"
            );

            let notificationsSent =
              await NotificationService.findNotificationsSentTasksUser(idUser);

            let notificationsNotSeen =
              await NotificationService.findNotificationsOfUserByState(
                "sent",
                idUser
              );
            socketConnection.socket.emit("newNotifications", notificationsSent);

            socketConnection.socket.emit(
              "newNotificationsNotSeen",
              notificationsNotSeen
            );
          }
        },
        {
          connection: {
            host: redisConnection.propHost,
            port: redisConnection.propPort,
            password: redisConnection.propPassword
          }
        }
      );
    } catch (error) {
      throw error;
    }
    myWorker.on("error", (err) => {
      console.error(err);
    });
  },

  updateNotificationQueue: async (idNotification, task, idUser) => {
    try {
      let jobNotificationFound =
        await ScheduledJobService.getJobByIdNotification(idNotification);
      let idJob = `'${jobNotificationFound.idJob}'`;
      await NotificationToQueue.deleteNotificationFromQueue(idJob);
      await NotificationToQueue.scheduleNotificationToQueue(
        idUser,
        task,
        idJob
      );
    } catch (error) {
      throw new Error(error);
    }
  }
};
