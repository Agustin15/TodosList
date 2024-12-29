import express from "express";
import cors from "cors";
import { tasksRouter } from "./routes/todoRoutes.js";
import { signUpRouter } from "./routes/signUpRoutes.js";
import { loginRoutes } from "./routes/loginRoutes.js";
import { stateTokenRoutes } from "./routes/stateTokenRoutes.js";

export const app = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/todos", tasksRouter);
app.use("/signup", signUpRouter);
app.use("/login", loginRoutes);
app.use("/token", stateTokenRoutes);

app.use((error, req, res, next) => {
  console.log("Error", error);
  res.status(500).json({ messageError: "Internal Server error" });
});
