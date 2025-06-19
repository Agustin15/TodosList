import { authRequest } from "../../auth/auth.js";
import { Task } from "../../model/todoModel.js";

const taskModel = new Task();

const formatDate = (date) => {
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
};

export const getTasksForCalendarByUser = async (req, res) => {
  let tasks;
  try {
    const validAuthRequest = await authRequest(req, res);

    tasks = await taskModel.getAllTasksByUser(validAuthRequest.idUser);

    tasks = tasks.map((task) => {
      return {
        extendedProps: { idTask: task.idTask },
        title: task.descriptionTask,
        date: formatDate(task.datetimeTask),
        color: task.isCompleted ? "green" : "red"
      };
    });

    res.status(200).json(tasks);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
