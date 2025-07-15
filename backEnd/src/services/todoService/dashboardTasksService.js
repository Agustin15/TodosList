import { Task } from "../../model/todoModel.js";
import { TaskService } from "./taskService.js";
import { FileService } from "../fileService.js";
const taskModel = new Task();

export const DashboardTasksService = {
  getTasksByWeekday: async (idUser) => {
    try {
      let firstSunday = TaskService.getFirstSunday();
      let nextSaturday = TaskService.getNextSaturday();

      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = 0;

      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      let tasksIncompleteByWeekday = await Promise.all(
        days.map(async (day, index) => {
          let tasksWeekday = await taskModel.getTasksStateByWeekday(
            firstSunday,
            nextSaturday,
            index
          );
          return {
            weekday: day,
            quantity: tasksWeekday.length
          };
        })
      );

      taskModel.propIsCompleted = 1;
      let tasksCompleteByWeekday = await Promise.all(
        days.map(async (day, index) => {
          let tasksCompleteWeekday = await taskModel.getTasksStateByWeekday(
            firstSunday,
            nextSaturday,
            index
          );

          return {
            weekday: day,
            quantity: tasksCompleteWeekday.length
          };
        })
      );

      return {
        tasksIncompleteByWeekday: tasksIncompleteByWeekday,
        tasksCompleteByWeekday: tasksCompleteByWeekday
      };
    } catch (error) {
      throw error;
    }
  },

  getTasksThisWeekUser: async (idUser) => {
    try {
      let firstSunday = TaskService.getFirstSunday();
      let nextSaturday = TaskService.getNextSaturday();

      taskModel.propIdUser = idUser;

      let tasksThisWeekUser = await taskModel.getTasksThisWeekUser(
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
  }
};
