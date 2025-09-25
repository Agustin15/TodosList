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
        { day: "Sunday", weekday: 6 },
        { day: "Monday", weekday: 0 },
        { day: "Tuesday", weekday: 1 },
        { day: "Wednesday", weekday: 2 },
        { day: "Thursday", weekday: 3 },
        { day: "Friday", weekday: 4 },
        { day: "Saturday", weekday: 5 }
      ];

      let tasksIncompleteByWeekday = await Promise.all(
        days.map(async (day) => {
          let tasksWeekday = await taskModel.getTasksStateByWeekday(
            firstSunday,
            nextSaturday,
            day.weekday
          );

          return {
            weekday: day.day,
            quantity: tasksWeekday.length
          };
        })
      );

      taskModel.propIsCompleted = 1;
      let tasksCompleteByWeekday = await Promise.all(
        days.map(async (day) => {
          let tasksCompleteWeekday = await taskModel.getTasksStateByWeekday(
            firstSunday,
            nextSaturday,
            day.weekday
          );

          return {
            weekday: day.day,
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
  },

  getDataForChartTasksMonthly: async (idUser, year) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "Novemeber",
      "December"
    ];

    try {
      taskModel.propIdUser = idUser;

      const tasksByMonth = await Promise.all(
        months.map(async (month, index) => {
          const quantityTasks = await taskModel.getQuantityTasksByMonthAndYear(
            index + 1,
            year
          );

          return {
            year: year,
            month: index,
            quantityTasks: quantityTasks
          };
        })
      );

      let quantityTasksInYear = await taskModel.getQuantityTasksInYear(year);

      if (quantityTasksInYear == 0) {
        return null;
      }
      const average = quantityTasksInYear / months.length;

      return { tasksByMonth: tasksByMonth, average: average };
    } catch (error) {
      throw error;
    }
  }
};
