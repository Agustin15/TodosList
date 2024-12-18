import express from "express";
import { tasksRouter } from "./routes/todoRoutes.js";

export const app = express();

app.use(express.json());

app.use("/todos", tasksRouter);

app.use((error, req, res, next) => {
  console.log("Error", error);

  res.status(500).json({ messageError: "Internal Server error" });
});
