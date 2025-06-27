import { Task } from "../../model/todoModel.js";

const taskModel = new Task();

export const CalendarTasksService = {
  formatDate: (date) => {
    let dateToFormat = new Date(date);
    let year = dateToFormat.getFullYear();
    let month = dateToFormat.getMonth() + 1;
    let day = dateToFormat.getDate();
    let hour = dateToFormat.getHours();
    let minutes = dateToFormat.getMinutes();

    let dateString =
      year +
      "-" +
      (month < 10 ? `0${month}` : month) +
      "-" +
      (day < 10 ? `0${day}` : day) +
      " " +
      (hour < 10 ? `0${hour}` : hour) +
      ":" +
      (minutes < 10 ? `0${minutes}` : minutes);

    return dateString;
  },

  getTasksForCalendarByUser: async (idUser) => {
    let tasks;
    try {
      tasks = await taskModel.getAllTasksByUser(idUser);

      tasks = tasks.map((task) => {
        try {
          return {
            extendedProps: { idTask: task.idTask },
            title: task.descriptionTask,
            date: CalendarTasksService.formatDate(task.datetimeTask),
            color: task.isCompleted ? "green" : "red"
          };
        } catch (error) {
          throw new Error(error);
        }
      });

      return tasks;
    } catch (error) {
      throw error;
    }
  }
};
