import express from "express";
import {
  getTasksByUsername,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/todoController.js";

export const tasksRouter = express.Router();

tasksRouter.get("/:username", getTasksByUsername);
tasksRouter.get("/:id", getTaskById);
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id",deleteTask);
