import express from "express";
import {
  createTask,
  updateStateTask,
  updateTask,
  deleteTask,
  getTasksLimitByFilterOption,
  getQuantityTasksByFilterOption,
  getTasksThisWeekByStateAndUser,
  getTasksThisWeekByStateAndUserLimit,
  getYearsOfTasks,
  getTasksByDayAndState,
  getTaskById
} from "../controllers/todoController/todoController.js";

import { getTasksForCalendarByUser } from "../controllers/todoController/calendarTasks.js";
import {
  getTasksByWeekday,
  getTasksThisWeekUser
} from "../controllers/todoController/dashboardTasks.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const tasksRouter = express.Router();

tasksRouter.get("/:optionGetTasks", (req, res) => {
  const { option } = JSON.parse(req.params.optionGetTasks);

  switch (option) {
    case "getTasksByWeekday":
      return getTasksByWeekday(req, res);

    case "getTasksThisWeekUser":
      return getTasksThisWeekUser(req, res);

    case "getTasksThisWeekByStateAndUser":
      return getTasksThisWeekByStateAndUser(req, res);

    case "getTasksThisWeekByStateAndUserLimit":
      return getTasksThisWeekByStateAndUserLimit(req, res);

    case "getTasksLimitByFilterOption":
      return getTasksLimitByFilterOption(req, res);

    case "getQuantityTasksByFilterOption":
      return getQuantityTasksByFilterOption(req, res);

    case "getYearsTasks":
      return getYearsOfTasks(req, res);

    case "getTaskById":
      return getTaskById(req, res);

    case "getTasksByWeekdayFromChart":
      return getTasksByDayAndState(req, res);

    case "getTasksForCalendarByUser":
      return getTasksForCalendarByUser(req, res);
  }
});
tasksRouter.post("/", upload.any(), createTask);
tasksRouter.put("/:id", upload.any(), updateTask);
tasksRouter.patch("/:id", updateStateTask);
tasksRouter.delete("/:id", deleteTask);
