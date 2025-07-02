import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { tasksRouter } from "./routes/todoRoutes.js";
import { signUpRouter } from "./routes/signUpRoutes.js";
import { loginRoutes } from "./routes/loginRoutes.js";
import { resetPasswordRoutes } from "./routes/resetPasswordRoutes.js";
import { userDataRoutes } from "./routes/userDataRoutes.js";
import { logoutRoutes } from "./routes/logoutRoutes.js";
import { filesRoutes } from "./routes/filesRoutes.js";
import { subscriptionRoutes } from "./routes/subscriptionPushRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { NotificationToQueue } from "./services/notificationsQueue.js";
import { Server } from "socket.io";

const app = express();
export const server = createServer(app);
app.use(express.json());

app.use(cookieParser());
app.use("/todos", tasksRouter);
app.use("/files", filesRoutes);
app.use("/signup", signUpRouter);
app.use("/login", loginRoutes);
app.use("/resetPassword", resetPasswordRoutes);
app.use("/userData", userDataRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/notification", notificationRoutes);
app.use("/logout", logoutRoutes);

NotificationToQueue.createNotificationQueue();
NotificationToQueue.workerNotificationQueue();

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});

app.use((error, req, res, next) => {
  console.log("Error", error);
  res.status(500).json({ messageError: "Internal Server error" });
});
