import express from "express";
import {
  getTasksByEmail,
  getStateTasksByEmail,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/todoController.js";

export const tasksRouter = express.Router();

tasksRouter.get("/:optionGetTasks", (req, res) => {
  const { option } = JSON.parse(req.params.optionGetTasks);
  switch (option) {
    case "getTasksByEmail":
      return getTasksByEmail(req, res);

    case "getStateTasksByEmail":
      return getStateTasksByEmail(req, res);
  }
});
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);
