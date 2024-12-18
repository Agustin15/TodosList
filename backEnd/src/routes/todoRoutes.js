import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/todoController.js";

export const tasksRouter = express.Router();

tasksRouter.get("/", getAllTasks);
tasksRouter.get("/:id", getTaskById);
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id",deleteTask);
