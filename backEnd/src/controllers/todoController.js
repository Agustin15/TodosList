import mongoose from "mongoose";
import { TaskModel } from "../model/todoModel.js";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getTasksByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const tasks = await TaskModel.find({user:username});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error("Id not valid");
    }
    const taskFoundById = await TaskModel.findById(req.params.id);

    if (!taskFoundById) {
      throw new Error("Task not found");
    }

    res.status(200).json(taskFoundById);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const createTask = async (req, res) => {
  const task = req.body;

  try {
    const taskExisting = await findTaskExisting(task);

    if (taskExisting) {
      throw new Error("This task already exists");
    }
    const taskCreated = await TaskModel.create(task);

    res.status(201).json(taskCreated);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

const findTaskExisting = async (task) => {
  try {
    let taskToFind = {
      name: task.name,
      description: task.description,
      user: task.username,
    };

    const taskExisting = await TaskModel.findOne(taskToFind);
    return taskExisting;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error("Id not valid");
    }

    const taskUpdated = await TaskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(taskUpdated);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new Error("Id not valid");
    }

    await TaskModel.findByIdAndDelete(req.params.id);
    res
      .status(201)
      .json({ message: `Task ${req.params.id} deleted succesfully` });
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
