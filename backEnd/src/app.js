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
import { storageRoutes } from "./routes/storageRoutes.js";
import { subscriptionRoutes } from "./routes/subscriptionPushRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { NotificationToQueue } from "./services/notificationsQueue.js";
import { ConnectionSocket } from "./config/connectionSocket.js";
import { helpQueryClientRoutes } from "./routes/helpQueryClientRoutes.js";
import { verificationTwoStepRoutes } from "./routes/verificationTwoStepRoutes.js";
import { verificationCodeRoutes } from "./routes/verificationCodeRoutes.js";

const app = express();
export const server = createServer(app);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome todolist server");
});

app.use("/todos", tasksRouter);
app.use("/files", filesRoutes);
app.use("/storage", storageRoutes);
app.use("/signup", signUpRouter);
app.use("/login", loginRoutes);
app.use("/verificationTwoStep", verificationTwoStepRoutes);
app.use("/verificationCode", verificationCodeRoutes);
app.use("/resetPassword", resetPasswordRoutes);
app.use("/userData", userDataRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/notification", notificationRoutes);
app.use("/helpQuery", helpQueryClientRoutes);
app.use("/logout", logoutRoutes);

export const socketConnection = new ConnectionSocket(server);
try {
  NotificationToQueue.workerNotificationQueue();

  socketConnection.io.on("connection", (socket) => {
    socketConnection.propSocket = socket;
  });
} catch (error) {
  console.log(error);
}
