import { Worker, Queue } from "bullmq";
import webpush from "web-push";
import { getSubscriptionsByIdUser } from "./subscriptionPushController.js";
import { updateStateNotification } from "./notificationsController.js";
import { getJobByIdNotification } from "./scheduledJobController.js";

let notificationQueue;

const connection = {
  host: process.env.HOST_REDIS,
  port: process.env.PORT_REDIS,
  password: process.env.PASSWORD_REDIS
};

export const createNotificationQueue = () => {
  try {
    if (!connection.port) throw new Error("Redis port not declared");
    if (!connection.host) throw new Error("Redis host not declared");
    if (!connection.password) throw new Error("Redis password not declared");

    notificationQueue = new Queue("notifications", {
      connection: connection
    });
  } catch (error) {
    throw error;
  }
};

export const deleteNotificationFromQueue = async (idJob) => {
  try {
    let jobFound = await notificationQueue.getJob(idJob);

    if (jobFound) {
      await jobFound.remove();
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const scheduleNotificationToQueue = async (idUser, task, idJob) => {
  try {
    const payload = {
      idTask: task.idTask,
      iconTask: task.icon,
      descriptionTask: task.descriptionTask,
      datetimeTask: task.datetimeTask,
      datetimeNotification: task.datetimeNotification
    };

    let delay = new Date(task.datetimeNotification).getTime() - Date.now();

    let notificationQueueAdded = await notificationQueue.add(
      "sendNotification",
      { idUser: idUser, payload: payload },
      { jobId: idJob, delay: delay }
    );

    if (!notificationQueueAdded) throw new Error("Failed to add job to queue");
  } catch (error) {
    throw error;
  }
};

export const workerNotificationQueue = () => {
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
          throw new Error("Vapid private key not declared");
        if (!process.env.VAPID_PRIVATE_KEY)
          throw new Error("Vapid public key not declared");
        if (!process.env.MAILTO_EMAIL_NOTFICATION_SERVER)
          throw new Error("Mailto email not declared");

        let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
        let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
        let mailtoEmail = process.env.MAILTO_EMAIL_NOTFICATION_SERVER;

        webpush.setVapidDetails(mailtoEmail, vapidPublicKey, vapidPrivateKey);

        let userSubscriptions = await getSubscriptionsByIdUser(idUser);

        if (userSubscriptions.length == 0)
          throw new Error("Error, subscriptions not found");

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
        if (sent) await updateStateNotification(task.idTask, "sent");
      },
      {
        connection: connection
      }
    );
  } catch (error) {
    throw error;
  }
  myWorker.on("error", (err) => {
    console.error(err);
  });
};

export const updateNotificationQueue = async (idNotification, task, idUser) => {
  let jobNotificationFound = await getJobByIdNotification(idNotification);
  let idJob = `'${jobNotificationFound.idJob}'`;
  await deleteNotificationFromQueue(idJob);
  await scheduleNotificationToQueue(idUser, task, idJob);
};
