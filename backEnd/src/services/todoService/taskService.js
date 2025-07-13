import connection from "../../config/database.js";
import { Task } from "../../model/todoModel.js";
import { FileService } from "../fileService.js";
import { DashboardTasksService } from "./dashboardTasksService.js";
import { NotificationService } from "../notificationService.js";
import { SubscriptionPushService } from "../subscriptionPushService.js";
import { NotificationToQueue } from "../notificationsQueue.js";
import { ScheduledJobService } from "../scheduledJobService.js";

const taskModel = new Task();
export const TaskService = {
  getYearsOfTasks: async (idUser) => {
    try {
      taskModel.propIdUser = idUser;

      const yearsTasks = await taskModel.getYearsTask();
      return yearsTasks;
    } catch (error) {
      throw error;
    }
  },

  getTasksThisWeekByStateAndUserLimit: async (offset, idUser, state) => {
    try {
      let firstSunday = DashboardTasksService.getFirstSunday();
      let nextSaturday = DashboardTasksService.getNextSaturday();

      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = state;

      let tasksThisWeekUser =
        await taskModel.getTasksThisWeekByStateAndUserLimit(
          firstSunday,
          nextSaturday,
          offset
        );

      tasksThisWeekUser = await Promise.all(
        tasksThisWeekUser.map(async (task) => {
          let filesTask = await FileService.findFilesByIdTask(task.idTask);
          let notificationFound =
            await NotificationService.findNotificationByIdTask(task.idTask);
          notificationFound.length > 0
            ? (task.datetimeNotification = notificationFound[0].datetimeSend)
            : (task.datetimeNotification = "");

          task.filesUploaded = filesTask;

          return task;
        })
      );

      return tasksThisWeekUser;
    } catch (error) {
      throw error;
    }
  },

  getTasksThisWeekByStateAndUser: async (idUser, state) => {
    try {
      let firstSunday = DashboardTasksService.getFirstSunday();
      let nextSaturday = DashboardTasksService.getNextSaturday();

      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = state;

      let tasksThisWeekUser = await taskModel.getTasksThisWeekByStateAndUser(
        firstSunday,
        nextSaturday
      );

      tasksThisWeekUser = await Promise.all(
        tasksThisWeekUser.map(async (task) => {
          let dateTask = new Date(task.datetimeTask);

          let datetimeString = new Intl.DateTimeFormat("en-UY", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }).format(dateTask);

          let filesTask = await FileService.findFilesByIdTask(task.idTask);

          return {
            id: task.idTask,
            icon: task.icon,
            description: task.descriptionTask,
            idUser: task.idUser,
            date: datetimeString,
            isCompleted: task.isCompleted,
            files: filesTask
          };
        })
      );

      return tasksThisWeekUser;
    } catch (error) {
      throw error;
    }
  },
  getTasksLimitByFilterOption: async (idUser, year, month, state, offset) => {
    let tasks;
    try {
      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = state;

      tasks = await taskModel.getTasksLimitByFilterOption(year, month, offset);

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
      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = state;

      tasks = await taskModel.getQuantityTasksByFilterOption(year, month);

      return tasks;
    } catch (error) {
      throw error;
    }
  },

  getTaskById: async (idUser, idTask) => {
    try {
      taskModel.propIdTask = idTask;
      taskModel.propIdUser = idUser;

      const taskFoundById = await taskModel.getTaskById();

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

      let notificationFound =
        NotificationService.findNotificationByIdTask(idTask);

      if (notificationFound.length > 0) {
        let jobNotificationFound = ScheduledJobService.getJobByIdNotification(
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
