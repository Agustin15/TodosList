import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  description: { type: String, required: true },
});

export const TaskModel = mongoose.model("Task", taskSchema);
