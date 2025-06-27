import connection from "../../config/database.js";
import { Task } from "../../model/todoModel.js";
import { FileService } from "../fileService.js";
import { NotificationService } from "../notificationService.js";
import { SubscriptionPushService } from "../subscriptionPushService.js";
import { NotificationToQueue } from "../notificationsQueue.js";
import { ScheduledJobService } from "../scheduledJobService.js";
const taskModel = new Task();

export const TaskService = {
  getYearsOfTasks: async (idUser) => {
    try {
      const yearsTasks = await taskModel.getYearsTask(idUser);
      return yearsTasks;
    } catch (error) {
      throw error;
    }
  },

  getTasksLimitByFilterOption: async (idUser, year, month, state, offset) => {
    let tasks;
    try {
      tasks = await taskModel.getTasksLimitByFilterOption(
        idUser,
        year,
        month,
        state,
        offset
      );

      for (const task of tasks) {
        let filesTask = await FileService.findFilesByIdTask(task.idTask);
        let notificationFound =
          await NotificationService.findNotificationByIdTask(task.idTask);
        task.filesUploaded = filesTask;
        notificationFound.length > 0
          ? (task.datetimeNotification = notificationFound[0].datetimeSend)
          : (task.datetimeNotification = "");
      }

      return tasks;
    } catch (error) {
      throw error;
    }
  },

  getQuantityTasksByFilterOption: async (idUser, year, month, state) => {
    let tasks;
    try {
      tasks = await taskModel.getQuantityTasksByFilterOption(
        idUser,
        year,
        month,
        state
      );

      return tasks;
    } catch (error) {
      throw error;
    }
  },

  getTaskById: async (idUser,idTask) => {
    try {
      const taskFoundById = await taskModel.getTaskById(idUser, idTask);

      if (!taskFoundById || taskFoundById.length == 0) {
        throw new Error("Task not found");
      }

      let filesTask = await FileService.findFilesByIdTask(idTask);
      taskFoundById[0].filesUploaded = filesTask;

      return taskFoundById;
    } catch (error) {
      throw error;
    }
  },

  findTasksByIdTask: async (idTask, idUser) => {
    const taskFound = await taskModel.getTaskById(idUser, idTask);
    return taskFound;
  },

  findTaskRecentlyAdded: async (idUser, description, datetime) => {
    try {
      const taskFound = await taskModel.getTaskRecentlyAdded(
        idUser,
        description,
        datetime
      );

      if (taskFound.length == 0) throw new Error("Error,task not found");

      return taskFound[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  createTask: async (task, idUser,files) => {
    try {
      await connection.beginTransaction();

      const taskCreated = await taskModel.addTask(
        idUser,
        task.icon,
        task.descriptionTask,
        task.datetimeTask,
        0
      );

      if (taskCreated == 0) {
        throw new Error("Error to add task");
      }

      let taskAddedFound = await TaskService.findTaskRecentlyAdded(
        idUser,
        task.descriptionTask,
        task.datetimeTask
      );

      if (files.length > 0) {
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

  updateTask: async (task,files, idTask, idUser) => {
    try {
      await connection.beginTransaction();

      const taskUpdated = await taskModel.updateTask(
        task.icon,
        task.descriptionTask,
        task.datetimeTask,
        task.state,
        idTask
      );

      if (taskUpdated == 0) {
        throw new Error("Failed to update task");
      }

      let taskUpdatedFound = await TaskService.findTasksByIdTask(
        idTask,
        idUser
      );

      taskUpdatedFound = taskUpdatedFound[0];

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

  updateStateTask: async (newState, idTask,idUser) => {
    try {
      const taskStateUpdated = await taskModel.updateStateTask(
        newState,
        idTask
      );

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

      let notificationFound =
        NotificationService.findNotificationByIdTask(idTask);

      if (notificationFound.length > 0) {
        let jobNotificationFound = ScheduledJobService.getJobByIdNotification(
          notificationFound[0].idNotification
        );

        jobId = `'${jobNotificationFound.idJob}'`;
      }

      let deletedTask = await taskModel.deleteTask(idTask);

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
