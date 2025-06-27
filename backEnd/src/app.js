import express from "express";
import cookieParser from "cookie-parser";
import { tasksRouter } from "./routes/todoRoutes.js";
import { signUpRouter } from "./routes/signUpRoutes.js";
import { loginRoutes } from "./routes/loginRoutes.js";
import { resetPasswordRoutes } from "./routes/resetPasswordRoutes.js";
import { userDataRoutes } from "./routes/userDataRoutes.js";
import { logoutRoutes } from "./routes/logoutRoutes.js";
import { filesRoutes } from "./routes/filesRoutes.js";
import { subscriptionRoutes } from "./routes/subscriptionPushRoutes.js";
import { NotificationToQueue } from "./services/notificationsQueue.js";
export const app = express();

app.use(express.json());

app.use(cookieParser());
app.use("/todos", tasksRouter);
app.use("/files", filesRoutes);
app.use("/signup", signUpRouter);
app.use("/login", loginRoutes);
app.use("/resetPassword", resetPasswordRoutes);
app.use("/userData", userDataRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/logout", logoutRoutes);

NotificationToQueue.createNotificationQueue();
NotificationToQueue.workerNotificationQueue();

app.use((error, req, res, next) => {
  console.log("Error", error);
  res.status(500).json({ messageError: "Internal Server error" });
});
