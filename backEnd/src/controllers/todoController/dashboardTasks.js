import { findFilesByIdTask } from "../fileController.js";
import { authRequest } from "../../auth/auth.js";
import { Task } from "../../model/todoModel.js";
import { findNotificationByIdTask } from "../notificationsController.js";

const taskModel = new Task();

export const getTasksByWeekday = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    let firstSunday = getFirstSunday();
    let nextSaturday = getNextSaturday();

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
          validAuthRequest.idUser,
          firstSunday,
          nextSaturday,
          index,
          0
        );
        return {
          weekday: day,
          quantity: tasksWeekday.length
        };
      })
    );

    let tasksCompleteByWeekday = await Promise.all(
      days.map(async (day, index) => {
        let tasksCompleteWeekday = await taskModel.getTasksStateByWeekday(
          validAuthRequest.idUser,
          firstSunday,
          nextSaturday,
          index,
          1
        );

        return {
          weekday: day,
          quantity: tasksCompleteWeekday.length
        };
      })
    );

    res.status(200).json({
      tasksIncompleteByWeekday: tasksIncompleteByWeekday,
      tasksCompleteByWeekday: tasksCompleteByWeekday
    });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTasksThisWeekUserLimit = async (req, res) => {
  try {
    if (!req.params) {
      throw new Error("Params request null");
    }

    const params = JSON.parse(req.params.optionGetTasks);
    const validAuthRequest = await authRequest(req, res);

    let firstSunday = getFirstSunday();
    let nextSaturday = getNextSaturday();

    let tasksThisWeekUser = await taskModel.getTasksThisWeekUserLimit(
      validAuthRequest.idUser,
      firstSunday,
      nextSaturday,
      params.offset
    );

    tasksThisWeekUser = await Promise.all(
      tasksThisWeekUser.map(async (task) => {
        let filesTask = await findFilesByIdTask(task.idTask);
        let notificationFound = await findNotificationByIdTask(task.idTask);
        notificationFound.length > 0
          ? (task.datetimeNotification = notificationFound[0].datetimeSend)
          : (task.datetimeNotification = "");

        task.filesUploaded = filesTask;

        return task;
      })
    );

    res.status(200).json(tasksThisWeekUser);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTasksThisWeekUser = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    let firstSunday = getFirstSunday();
    let nextSaturday = getNextSaturday();

    let tasksThisWeekUser = await taskModel.getTasksThisWeekUser(
      validAuthRequest.idUser,
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

        let filesTask = await findFilesByIdTask(task.idTask);

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

    res.status(200).json(tasksThisWeekUser);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

const getFirstSunday = () => {
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
};

const getNextSaturday = () => {
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
};
