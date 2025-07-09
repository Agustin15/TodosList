import { Task } from "../../model/todoModel.js";
import { FileService } from "../fileService.js";
const taskModel = new Task();

export const DashboardTasksService = {
  getTasksByWeekday: async (idUser) => {
    try {
      let firstSunday = DashboardTasksService.getFirstSunday();
      let nextSaturday = DashboardTasksService.getNextSaturday();

      taskModel.propIdUser = idUser;
      taskModel.propIsCompleted = 0;

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
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
      let firstSunday = DashboardTasksService.getFirstSunday();
      let nextSaturday = DashboardTasksService.getNextSaturday();

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

          let filesTask = await FileService.findFilesByIdTask(task);

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
  }
};
