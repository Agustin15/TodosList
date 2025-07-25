import connection from "../../config/database.js";
import { Task } from "../../model/todoModel.js";
import { FileService } from "../fileService.js";
import { NotificationService } from "../notificationService.js";
import { SubscriptionPushService } from "../subscriptionPushService.js";
import { NotificationToQueue } from "../notificationsQueue.js";
import { ScheduledJobService } from "../scheduledJobService.js";

const taskModel = new Task();

export const TaskService = {
  getFirstSunday: () => {
    let dateCurrent = new Date();
    dateCurrent.setMinutes(
      dateCurrent.getMinutes() - dateCurrent.getTimezoneOffset()
    );

    if (dateCurrent.getDay() == 0) {
      return dateCurrent;
    } else {
      let millisecondsDays = 3600000 * 24 * dateCurrent.getDay();
      let firstSundayMillieseconds = dateCurrent.getTime() - millisecondsDays;
      let firstSunday = new Date(firstSundayMillieseconds);
      return firstSunday;
    }
  },

  getNextSaturday: () => {
    let dateCurrent = new Date();
    dateCurrent.setMinutes(
      dateCurrent.getMinutes() - dateCurrent.getTimezoneOffset()
    );

    if (dateCurrent.getDay() == 6) {
      return dateCurrent;
    } else {
      let differencesDays = 6 - dateCurrent.getDay();
      let millisecondsDays = 3600000 * 24 * differencesDays;

      let nextSaturdayMillieseconds = dateCurrent.getTime() + millisecondsDays;
      let nextSaturday = new Date(nextSaturdayMillieseconds);
      return nextSaturday;
    }
  },

  findTasksByIdTask: async (idTask, idUser) => {
    try {
      taskModel.propIdTask = idTask;
      taskModel.propIdUser = idUser;

      const taskFound = await taskModel.getTaskById();
      return taskFound;
    } catch (error) {
      throw new Error(error);
    }
  },

  findTaskRecentlyAdded: async (idUser, description, datetime) => {
    try {
      taskModel.propIdUser = idUser;
      taskModel.propDescription = description;
      taskModel.propDatetime = datetime;

      const taskFound = await taskModel.getTaskRecentlyAdded();

      if (taskFound.length == 0) throw new Error("Error,task not found");

      return taskFound[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  createTask: async (task, idUser, files) => {
    try {
      await connection.beginTransaction();

      taskModel.propIdUser = idUser;
      taskModel.propIcon = task.icon;
      taskModel.propDescription = task.descriptionTask;
      taskModel.propDatetime = task.datetimeTask;
      taskModel.propIsCompleted = 0;

      const taskCreated = await taskModel.post();

      if (taskCreated == 0) {
        throw new Error("Error to add task");
      }

      let taskAddedFound = await TaskService.findTaskRecentlyAdded(
        idUser,
        task.descriptionTask,
        task.datetimeTask
      );

      if (files.length > 0) {
        if (FileService.verifyAmountSizeOfFiles(files))
          throw new Error("Limit amount size of 10MB of files exceeded");

        let fileAdded = await FileService.addFile(taskAddedFound.idTask, files);

        if (!fileAdded.result) {
          errorAddFile = true;
        }
      }

      let filesTask = await FileService.findFilesByIdTask(
        taskAddedFound.idTask
      );
      taskAddedFound.filesUploaded = filesTask;
      taskAddedFound.datetimeNotification = task.datetimeNotification;

      let userSubscriptions =
        await SubscriptionPushService.getSubscriptionsByIdUser(idUser);

      if (
        userSubscriptions.length > 0 &&
        task.datetimeNotification.length > 0
      ) {
        await NotificationService.addNotification(
          userSubscriptions,
          taskAddedFound,
          idUser
        );
      }

      await connection.commit();
      return taskAddedFound;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  },

  updateTask: async (task, files, idTask, idUser) => {
    try {
      await connection.beginTransaction();

      taskModel.propIcon = task.icon;
      taskModel.propDescription = task.descriptionTask;
      taskModel.propDatetime = task.datetimeTask;
      taskModel.propIsCompleted = parseInt(task.state);
      taskModel.propIdTask = idTask;

      const taskUpdated = await taskModel.put();

      if (taskUpdated == 0) {
        throw new Error("Failed to update task");
      }

      let taskUpdatedFound = await TaskService.findTasksByIdTask(
        idTask,
        idUser
      );

      taskUpdatedFound = taskUpdatedFound[0];

      if (files.length > 0) {
        if (FileService.verifyAmountSizeOfFiles(files))
          throw new Error("Limit amount size of 10MB of files exceeded");
      }

      let filesChanged = await FileService.findFilesChanged(idTask, files);
      if (filesChanged.filesForAdd.length > 0) {
        await FileService.addFile(idTask, filesChanged.filesForAdd);
      }
      if (filesChanged.filesForDelete.length > 0) {
        await FileService.deleteFile(filesChanged.filesForDelete);
      }

      let notification = await NotificationService.findNotificationByIdTask(
        idTask
      );
      task.idTask = idTask;

      if (notification.length > 0) {
        if (task.datetimeNotification.length == 0) {
          await NotificationService.deleteNotification(
            notification[0].idNotification
          );
        } else {
          await NotificationService.updateNotification(
            notification[0].idNotification,
            task.datetimeNotification
          );

          await NotificationToQueue.updateNotificationQueue(
            notification[0].idNotification,
            task,
            idUser
          );
        }
      } else if (task.datetimeNotification.length > 0) {
        let subscriptions =
          await SubscriptionPushService.getSubscriptionsByIdUser(idUser);
        await NotificationService.addNotification(subscriptions, task, idUser);
      }

      await connection.commit();

      let filesTask = await FileService.findFilesByIdTask(idTask);
      taskUpdatedFound.filesUploaded = filesTask;
      taskUpdatedFound.datetimeNotification = task.datetimeNotification;

      return taskUpdatedFound;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  },

  updateStateTask: async (newState, idTask, idUser) => {
    try {
      taskModel.propIsCompleted = newState;
      taskModel.propIdTask = idTask;

      const taskStateUpdated = await taskModel.patchStateTask();

      if (taskStateUpdated == 0) throw new Error("Failed to update state task");

      let task = await TaskService.findTasksByIdTask(idTask, idUser);
      let filesTask = await FileService.findFilesByIdTask(idTask);

      task[0].filesUploaded = filesTask;
      return task[0];
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (idTask) => {
    try {
      let jobId;

      await connection.beginTransaction();

      let notificationFound =await
        NotificationService.findNotificationByIdTask(idTask);

      if (notificationFound.length > 0) {
        let jobNotificationFound = await ScheduledJobService.getJobByIdNotification(
          notificationFound[0].idNotification
        );

        jobId = `'${jobNotificationFound.idJob}'`;
      }

      taskModel.propIdTask = idTask;

      let deletedTask = await taskModel.delete();

      if (deletedTask == 0) throw new Error("Failed to delete task");

      if (jobId) await NotificationToQueue.deleteNotificationFromQueue(jobId);

      await connection.commit();
      return deletedTask;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
};
