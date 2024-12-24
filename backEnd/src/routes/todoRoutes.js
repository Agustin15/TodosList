import express from "express";
import {
  getTasksByUsername,
  getStateTasksByUsername,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/todoController.js";

export const tasksRouter = express.Router();

tasksRouter.get("/:optionGetTasks", (req, res) => {
  const { option } = JSON.parse(req.params.optionGetTasks);
  switch (option) {
    case "getTasksByUsername":
      return getTasksByUsername(req, res);

    case "getStateTasksByUsername":
      return getStateTasksByUsername(req, res);
  }
});
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);
