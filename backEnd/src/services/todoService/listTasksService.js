import { Task } from "../../model/todoModel.js";
import { TaskService } from "./taskService.js";
import { FileService } from "../fileService.js";
import { NotificationService } from "../notificationService.js";

const taskModel = new Task();

export const ListTasksService = {
  getYearsOfTasks: async (idUser) => {
    try {
      taskModel.propIdUser = idUser;

      const yearsTasks = await taskModel.getYearsTask();
      return yearsTasks;
    } catch (error) {
      throw error;
    }
  },

  createTasksToList: async (tasks) => {
    const tasksToList = await Promise.all(
      tasks.map(async (task) => {
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

    return tasksToList;
  },
  getTasksThisWeekByStateAndUserLimit: async (offset, idUser, state) => {
    try {
      let firstSunday = TaskService.getFirstSunday();
      let nextSaturday = TaskService.getNextSaturday();

      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = state;

      let tasksThisWeekUser =
        await taskModel.getTasksThisWeekByStateAndUserLimit(
          firstSunday,
          nextSaturday,
          offset
        );

      let tasksToList = ListTasksService.createTasksToList(tasksThisWeekUser);
      return tasksToList;
    } catch (error) {
      throw error;
    }
  },

  getTasksThisWeekByStateAndUser: async (idUser, state) => {
    try {
      let firstSunday = TaskService.getFirstSunday();
      let nextSaturday = TaskService.getNextSaturday();

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

      let tasksToList = ListTasksService.createTasksToList(tasks);

      return tasksToList;
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

  getTasksByDayAndState: async (idUser, day, stateTasks) => {
    try {
      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ];
      let firstSunday = TaskService.getFirstSunday();
      let nextSaturday = TaskService.getNextSaturday();

      if (days.indexOf(day.toLowerCase()) == -1)
        throw new Error("Day not valid");

      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = stateTasks;

      let tasksStateByWeekday = await taskModel.getTasksStateByWeekday(
        firstSunday,
        nextSaturday,
        days.indexOf(day.toLowerCase())
      );

      let tasksToList = ListTasksService.createTasksToList(tasksStateByWeekday);
      return tasksToList;
    } catch (error) {
      throw new Error(error);
    }
  }
};
