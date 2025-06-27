import { authRequest } from "../../auth/auth.js";
import { TaskService } from "../../services/todoService/taskService.js";

export const getYearsOfTasks = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    const yearsTasks = await TaskService.getYearsOfTasks(
      validAuthRequest.idUser
    );

    res.status(200).json(yearsTasks);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTasksLimitByFilterOption = async (req, res) => {
  let tasks;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }

    const params = JSON.parse(req.params.optionGetTasks);

    if (typeof params.offset === "undefined") {
      throw new Error("Offset undefined");
    }

    if (typeof params.year === "undefined") {
      throw new Error("Year undefined");
    }
    if (typeof params.month === "undefined") {
      throw new Error("Month undefined");
    }
    if (typeof params.state === "undefined") {
      throw new Error("State undefined");
    }

    tasks = await TaskService.getTasksLimitByFilterOption(
      validAuthRequest.idUser,
      Number(params.year),
      Number(params.month),
      Number(params.state),
      Number(params.offset)
    );

    res.status(200).json(tasks);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getQuantityTasksByFilterOption = async (req, res) => {
  let tasks;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }
    const params = JSON.parse(req.params.optionGetTasks);

    if (typeof params.year === "undefined") {
      throw new Error("year undefined");
    }
    if (typeof params.month === "undefined") {
      throw new Error("month undefined");
    }

    tasks = await TaskService.getQuantityTasksByFilterOption(
      validAuthRequest.idUser,
      Number(params.year),
      Number(params.month),
      Number(params.state)
    );

    res.status(200).json(tasks);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);
    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }

    const { id } = JSON.parse(req.params.optionGetTasks);

    if (!id) {
      throw new Error("idTask undefined");
    }

    const taskFoundById = await TaskService.getTaskById(
      validAuthRequest.idUser,
      Number(id)
    );

    res.status(200).json(taskFoundById);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    const task = req.body;
    const files = req.files;

    if (typeof task.icon != "string" || task.icon.length == 0)
      throw new Error("Invalid icon, it must be a string");

    if (typeof task.descriptionTask != "string" || task.icon.length == 0)
      throw new Error("Invalid description, it must be a string");

    if (new Date(task.datetimeTask) == "Invalid Date")
      throw new Error("Invalid datetime task");

    if (
      task.datetimeNotification.length > 0 &&
      new Date(task.datetimeNotification) == "Invalid Date"
    )
      throw new Error("Invalid datetime notification");

    if (new Date(task.datetimeTask).getTime() <= new Date().getTime())
      throw new Error("Datetime task must be higher than datetime now");

    if (
      task.datetimeNotification.length > 0 &&
      new Date(task.datetimeTask).getTime() <=
        new Date(task.datetimeNotification).getTime()
    )
      throw new Error("Datetime notification must be less than datetime task");

    const taskCreated = await TaskService.createTask(
      task,
      validAuthRequest.idUser,
      files
    );

    res.status(201).json(taskCreated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    if (!req.params.id) throw new Error("idTask undefined");

    let task = req.body;
    let files = req.files;

    if (typeof task.icon != "string" || task.icon.length == 0)
      throw new Error("Invalid icon, it must be a string");

    if (typeof task.descriptionTask != "string" || task.icon.length == 0)
      throw new Error("Invalid description, it must be a string");

    if (new Date(task.datetimeTask) == "Invalid Date")
      throw new Error("Invalid datetime task");

    if (
      task.datetimeNotification.length > 0 &&
      new Date(task.datetimeNotification) == "Invalid Date"
    )
      throw new Error("Invalid datetime notification");

    if (typeof task.state === "undefined") throw new Error("state undefined");

    if (new Date(task.datetimeTask).getTime() <= new Date().getTime())
      throw new Error("Datetime task must be higher than datetime now");

    if (
      task.datetimeNotification.length > 0 &&
      new Date(task.datetimeTask).getTime() <=
        new Date(task.datetimeNotification).getTime()
    )
      throw new Error("Datetime notification must be less than datetime task");

    const taskUpdated = await TaskService.updateTask(
      task,
      files,
      Number(req.params.id),
      validAuthRequest.idUser
    );

    res.status(200).json(taskUpdated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateStateTask = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);
    if (req.body.newState == null) {
      throw new Error("Body request null");
    }
    if (!req.params.id) {
      throw new Error("idTask undefined");
    }

    if (typeof req.body.newState != "number") {
      throw new Error("Invalid format new state, must be a number 0 or 1");
    }

    const taskStateUpdated = await TaskService.updateStateTask(
      req.body.newState,
      Number(req.params.id),
      validAuthRequest.idUser
    );

    res.status(200).json(taskStateUpdated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await authRequest(req, res);
    if (!req.params.id) {
      throw new Error("idTask undefined");
    }

    let deletedTask = await TaskService.deleteTask(req.params.id);

    res.status(201).json(deletedTask);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
