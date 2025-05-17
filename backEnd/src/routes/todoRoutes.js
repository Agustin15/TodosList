import express from "express";
import {
  createTask,
  updateStateTask,
  updateTask,
  deleteTask,
  getTasksThisWeekUser,
  getTasksByWeekday,
  getTasksLimitByFilterOption,
  getQuantityTasksByFilterOption,
  getYearsOfTasks,
  getTasksThisWeekUserLimit,
  getTasksForCalendarByUser,
  getTaskById
} from "../controllers/todoController.js";
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

    case "getTasksThisWeekUserLimit":
      return getTasksThisWeekUserLimit(req, res);

    case "getTasksLimitByFilterOption":
      return getTasksLimitByFilterOption(req, res);

    case "getQuantityTasksByFilterOption":
      return getQuantityTasksByFilterOption(req, res);

    case "getYearsTasks":
      return getYearsOfTasks(req, res);

    case "getTaskById":
      return getTaskById(req, res);

    case "getTasksForCalendarByUser":
      return getTasksForCalendarByUser(req, res);
  }
});
tasksRouter.post("/", upload.any(), createTask);
tasksRouter.put("/:id", upload.any(), updateTask);
tasksRouter.patch("/:id", updateStateTask);
tasksRouter.delete("/:id", deleteTask);
