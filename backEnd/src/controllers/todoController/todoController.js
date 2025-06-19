import connection from "../../config/database.js";
import { Task } from "../../model/todoModel.js";
import { authRequest } from "../../auth/auth.js";
import {
  addFile,
  findFilesByIdTask,
  findFilesChanged,
  deleteFile
} from "../fileController.js";

import {
  deleteNotificationFromQueue,
  updateNotificationQueue
} from "../notificationsQueue.js";
import {
  addNotification,
  deleteNotification,
  findNotificationByIdTask,
  updateNotification
} from "../notificationsController.js";

import { getJobByIdNotification } from "../scheduledJobController.js";
import { getSubscriptionsByIdUser } from "../subscriptionPushController.js";

const taskModel = new Task();

export const getYearsOfTasks = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    const yearsTasks = await taskModel.getYearsTask(validAuthRequest.idUser);

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
    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }

    const params = JSON.parse(req.params.optionGetTasks);
    const validAuthRequest = await authRequest(req, res);

    tasks = await taskModel.getTasksLimitByFilterOption(
      validAuthRequest.idUser,
      params.year,
      params.month,
      params.state,
      params.offset
    );

    for (const task of tasks) {
      let filesTask = await findFilesByIdTask(task.idTask);
      let notificationFound = await findNotificationByIdTask(task.idTask);
      task.filesUploaded = filesTask;
      notificationFound.length > 0
        ? (task.datetimeNotification = notificationFound[0].datetimeSend)
        : (task.datetimeNotification = "");
    }

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
    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }
    const params = JSON.parse(req.params.optionGetTasks);

    const validAuthRequest = await authRequest(req, res);

    tasks = await taskModel.getQuantityTasksByFilterOption(
      validAuthRequest.idUser,
      params.year,
      params.month,
      params.state
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
    if (Object.values(req.params.optionGetTasks).length == 0) {
      throw new Error("optionGetTasks undefined");
    }

    const { id } = JSON.parse(req.params.optionGetTasks);
    const validAuthRequest = await authRequest(req);

    const taskFoundById = await taskModel.getTaskById(
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
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const findTasksByIdTask = async (idTask, idUser) => {
  const taskFound = await taskModel.getTaskById(idUser, idTask);
  return taskFound;
};

export const findTaskRecentlyAdded = async (idUser, description, datetime) => {
  try {
    const taskFound = await taskModel.getTaskRecentlyAdded(
      idUser,
      description,
      datetime
    );

    if (taskFound.length == 0) throw new Error("Error,task not found");

    return taskFound[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const createTask = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    const task = req.body;
    const files = req.files;

    const validAuthRequest = await authRequest(req);

    await connection.beginTransaction();

    const taskCreated = await taskModel.addTask(
      validAuthRequest.idUser,
      task.icon,
      task.descriptionTask,
      task.datetimeTask,
      0
    );

    if (taskCreated == 0) {
      throw new Error("Error to add task");
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
    }

    let filesTask = await findFilesByIdTask(taskAddedFound.idTask);
    taskAddedFound.filesUploaded = filesTask;
    taskAddedFound.datetimeNotification = task.datetimeNotification;

    let userSubscriptions = await getSubscriptionsByIdUser(
      validAuthRequest.idUser
    );

    if (userSubscriptions.length > 0 && task.datetimeNotification.length > 0) {
      await addNotification(
        userSubscriptions,
        taskAddedFound,
        validAuthRequest.idUser
      );
    }

    await connection.commit();
    res.status(201).json(taskAddedFound);
  } catch (error) {
    await connection.rollback();
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    if (!req.params.id) {
      throw new Error("id undefined");
    }

    let task = req.body;
    let files = req.files;

    const validAuthRequest = await authRequest(req);

    await connection.beginTransaction();

    const taskUpdated = await taskModel.updateTask(
      task.icon,
      task.descriptionTask,
      task.datetimeTask,
      task.state,
      req.params.id
    );

    if (taskUpdated == 0) {
      throw new Error("Failed to update task");
    }

    let taskUpdatedFound = await findTasksByIdTask(
      req.params.id,
      validAuthRequest.idUser
    );

    taskUpdatedFound = taskUpdatedFound[0];

    let filesChanged = await findFilesChanged(req.params.id, files);
    if (filesChanged.filesForAdd.length > 0) {
      await addFile(req.params.id, filesChanged.filesForAdd);
    }
    if (filesChanged.filesForDelete.length > 0) {
      await deleteFile(filesChanged.filesForDelete);
    }

    let notification = await findNotificationByIdTask(req.params.id);
    task.idTask = req.params.id;

    if (notification.length > 0) {
      if (task.datetimeNotification.length == 0) {
        await deleteNotification(notification[0].idNotification);
      } else {
        await updateNotification(
          notification[0].idNotification,
          task.datetimeNotification
        );

        await updateNotificationQueue(
          notification[0].idNotification,
          task,
          validAuthRequest.idUser
        );
      }
    } else if (task.datetimeNotification.length > 0) {
      let subscriptions = await getSubscriptionsByIdUser(
        validAuthRequest.idUser
      );
      await addNotification(subscriptions, task, validAuthRequest.idUser);
    }

    await connection.commit();

    let filesTask = await findFilesByIdTask(req.params.id);
    taskUpdatedFound.filesUploaded = filesTask;
    taskUpdatedFound.datetimeNotification = task.datetimeNotification;

    res.status(200).json(taskUpdatedFound);
  } catch (error) {
    await connection.rollback();
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateStateTask = async (req, res) => {
  try {
    if (!req.body.newState) {
      throw new Error("Body request null");
    }
    if (!req.params.id) {
      throw new Error("id undefined");
    }

    const validAuthRequest = await authRequest(req, res);

    const taskStateUpdated = await taskModel.updateStateTask(
      req.body.newState,
      req.params.id
    );

    if (taskStateUpdated == 0) throw new Error("Failed to update state task");

    let task = await findTasksByIdTask(req.params.id, validAuthRequest.idUser);
    let filesTask = await findFilesByIdTask(req.params.id);
    task[0].filesUploaded = filesTask;
    res.status(200).json(task[0]);
  } catch (error) {
    let errorCodeResponse = error.includes("Authentication") ? 401 : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    let jobId;

    if (!req.params.id) {
      throw new Error("id task undefined");
    }

    await authRequest(req, res);

    await connection.beginTransaction();

    let notificationFound = findNotificationByIdTask(req.params.id);

    if (notificationFound.length > 0) {
      let jobNotificationFound = getJobByIdNotification(
        notificationFound[0].idNotification
      );

      jobId = `'${jobNotificationFound.idJob}'`;
    }

    let deletedTask = await taskModel.deleteTask(req.params.id);

    if (deletedTask == 0) throw new Error("Failed to delete task");

    if (jobId) await deleteNotificationFromQueue(jobId);

    await connection.commit();
    res.status(201).json(deletedTask);
  } catch (error) {
    await connection.rollback();
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
