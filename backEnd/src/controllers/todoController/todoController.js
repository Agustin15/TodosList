import { authRequest } from "../../auth/auth.js";
import { TaskService } from "../../services/todoService/taskService.js";
import { ListTasksService } from "../../services/todoService/listTasksService.js";

export const getYearsOfTasks = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    const yearsTasks = await ListTasksService.getYearsOfTasks(
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

export const getTasksThisWeekByStateAndUserLimit = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!req.params) {
      throw new Error("Params request null");
    }
    const params = JSON.parse(req.params.optionGetTasks);

    if (typeof params.offset === "undefined") {
      throw new Error("Offset undefined");
    }

    let tasks = await ListTasksService.getTasksThisWeekByStateAndUserLimit(
      Number(params.offset),
      validAuthRequest.idUser,
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

export const getTasksThisWeekByStateAndUser = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!req.params) {
      throw new Error("Params request null");
    }
    const params = JSON.parse(req.params.optionGetTasks);

    let tasks = await ListTasksService.getTasksThisWeekByStateAndUser(
      validAuthRequest.idUser,
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

export const getTasksByDayAndState = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!req.params) {
      throw new Error("Params request null");
    }
    const params = JSON.parse(req.params.optionGetTasks);

    let tasks = await ListTasksService.getTasksByDayAndState(
      validAuthRequest.idUser,
      params.day,
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
export const getTasksLimitByFilterOption = async (req, res) => {
  let tasks;
  try {
    const validAuthRequest = await authRequest(req, res);

    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }

    const params = JSON.parse(req.params.optionGetTasks);

    if (typeof params.offset === "undefined")
      throw new Error("Offset undefined");

    if (!params.year) throw new Error("Year undefined");

    if (typeof !params.month == "undefined") throw new Error("Month undefined");

    tasks = await ListTasksService.getTasksLimitByFilterOption(
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

    if (!params.year) {
      throw new Error("Year undefined");
    }
    if (!params.month) {
      throw new Error("Month undefined");
    }

    tasks = await ListTasksService.getQuantityTasksByFilterOption(
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

    const taskFoundById = await ListTasksService.getTaskById(
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

    let deletedTask = await TaskService.deleteTask(Number(req.params.id));

    res.status(201).json(deletedTask);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
