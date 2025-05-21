import { TaskModel } from "../model/todoModel.js";
import { authRequest } from "../auth/auth.js";
import {
  addFile,
  findFilesByIdTask,
  findFilesChanged,
  deleteFile
} from "./fileController.js";
import connection from "../config/database.js";

export const getTasksByWeekday = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

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
        let tasksWeekday = await TaskModel.getTasksStateByWeekday(
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
        let tasksCompleteWeekday = await TaskModel.getTasksStateByWeekday(
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
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTasksThisWeekUserLimit = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const params = JSON.parse(req.params.optionGetTasks);
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    let firstSunday = getFirstSunday();
    let nextSaturday = getNextSaturday();

    let tasksThisWeekUser = await TaskModel.getTasksThisWeekUserLimit(
      validAuthRequest.idUser,
      firstSunday,
      nextSaturday,
      params.offset
    );

    tasksThisWeekUser = await Promise.all(
      tasksThisWeekUser.map(async (task) => {
        let filesTask = await findFilesByIdTask(task.idTask);
        task.filesUploaded = filesTask;
        return task;
      })
    );

    res.status(200).json(tasksThisWeekUser);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTasksThisWeekUser = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    let firstSunday = getFirstSunday();
    let nextSaturday = getNextSaturday();

    let tasksThisWeekUser = await TaskModel.getTasksThisWeekUser(
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

export const getYearsOfTasks = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    const yearsTasks = await TaskModel.getYearsTask(validAuthRequest.idUser);

    res.status(200).json(yearsTasks);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTasksLimitByFilterOption = async (req, res) => {
  let errorCodeResponse = 404;
  let tasks;
  try {
    const params = JSON.parse(req.params.optionGetTasks);
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    tasks = await TaskModel.getTasksLimitByFilterOption(
      validAuthRequest.idUser,
      params.year,
      params.month,
      params.state,
      params.offset
    );

    for (const task of tasks) {
      let filesTask = await findFilesByIdTask(task.idTask);

      task.filesUploaded = filesTask;
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

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
  let errorCodeResponse = 404;
  let tasks;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    tasks = await TaskModel.getAllTasksByUser(validAuthRequest.idUser);

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
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getQuantityTasksByFilterOption = async (req, res) => {
  let errorCodeResponse = 404;
  let tasks;
  try {
    const params = JSON.parse(req.params.optionGetTasks);

    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    tasks = await TaskModel.getQuantityTasksByFilterOption(
      validAuthRequest.idUser,
      params.year,
      params.month,
      params.state
    );

    res.status(200).json(tasks);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTaskById = async (req, res) => {
  const { id } = JSON.parse(req.params.optionGetTasks);
  let errorCodeResponse = 404;

  try {
    const validAuthRequest = await authRequest(req);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    const taskFoundById = await TaskModel.getTaskById(
      validAuthRequest.idUser,
      id
    );

    if (!taskFoundById || taskFoundById.length == 0) {
      throw new Error("Task not found");
    }

    let filesTask = await findFilesByIdTask(id);
    taskFoundById[0].filesUploaded = filesTask;

    res.status(200).json(taskFoundById);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const findTasksByIdTask = async (idTask, idUser) => {
  try {
    const taskFound = await TaskModel.getTaskById(idUser, idTask);
    return taskFound;
  } catch (error) {
    throw new Error("Error,task not found");
  }
};

export const findTaskRecentlyAdded = async (idUser, description, datetime) => {
  try {
    const taskFound = await TaskModel.getTaskRecentlyAdded(
      idUser,
      description,
      datetime
    );

    if (taskFound.length == 0) throw new Error("Error,task not found");

    return taskFound[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createTask = async (req, res) => {
  let errorCodeResponse = 502;
  let errorAddFile = false;
  try {
    const task = req.body;
    const files = req.files;

    const validAuthRequest = await authRequest(req);
    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    await connection.beginTransaction();
    const taskCreated = await TaskModel.addTask(
      validAuthRequest.idUser,
      task.icon,
      task.descriptionTask,
      task.datetimeTask,
      0
    );

    if (!taskCreated) {
      throw new Error("No se pudo agregar la tarea");
    }

    let taskAddedFound = await findTaskRecentlyAdded(
      validAuthRequest.idUser,
      task.descriptionTask,
      task.datetimeTask
    );

    if (files.length > 0) {
      let fileAdded = await addFile(taskAddedFound.idTask, files);

      if (!fileAdded.result) {
        errorAddFile = true;
      }

      if (errorAddFile) {
        throw new Error("No se pudo agregar el archivo de la tarea");
      }
    }

    let filesTask = await findFilesByIdTask(taskAddedFound.idTask);
    taskAddedFound.filesUploaded = filesTask;

    await connection.commit();
    res.status(201).json(taskAddedFound);
  } catch (error) {
    await connection.rollback();
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateTask = async (req, res) => {
  let errorCodeResponse = 404;

  try {
    let task = req.body;
    let files = req.files;

    const validAuthRequest = await authRequest(req);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    await connection.beginTransaction();
    const taskUpdated = await TaskModel.updateTask(
      task.icon,
      task.descriptionTask,
      task.datetimeTask,
      task.state,
      req.params.id
    );

    if (taskUpdated) {
      let taskUpdatedFound = await findTasksByIdTask(
        req.params.id,
        validAuthRequest.idUser
      );

      taskUpdatedFound = taskUpdatedFound[0];

      let filesChanged = await findFilesChanged(req.params.id, files);
      if (filesChanged.filesForAdd.length > 0) {
        let filesAdded = await addFile(req.params.id, filesChanged.filesForAdd);

        if (!filesAdded.result) throw new Error("Error al agregar archivo");
      }
      if (filesChanged.filesForDelete.length > 0) {
        let filesDeleted = await deleteFile(filesChanged.filesForDelete);

        if (!filesDeleted.result) throw new Error("Error al agregar archivo");
      }
      await connection.commit();

      let filesTask = await findFilesByIdTask(req.params.id);
      taskUpdatedFound.filesUploaded = filesTask;

      res.status(200).json(taskUpdatedFound);
    }
  } catch (error) {
    await connection.rollback();
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateStateTask = async (req, res) => {
  let errorCodeResponse = 404;

  try {
    const validAuthRequest = await authRequest(req, res);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    const taskStateUpdated = await TaskModel.updateStateTask(
      req.body.newState,
      req.params.id
    );

    if (taskStateUpdated) {
      let task = await findTasksByIdTask(
        req.params.id,
        validAuthRequest.idUser
      );
      let filesTask = await findFilesByIdTask(req.params.id);
      task[0].filesUploaded = filesTask;
      res.status(200).json(task[0]);
    }
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const deleteTask = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const validAuthRequest = authRequest(req);

    if (!validAuthRequest) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    await TaskModel.deleteTask(req.params.id);
    res
      .status(201)
      .json({ message: `Task ${req.params.id} deleted succesfully` });
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
