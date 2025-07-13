import { NotificationService } from "../services/notificationService.js";
import { authRequest } from "../auth/auth.js";

export const getNotificationsSentTasksUser = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);

    let notifications =
      await NotificationService.findNotificationsSentTasksUser(
        validAuth.idUser
      );

    res.status(200).json(notifications);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getNotificationsOfUserByState = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);
    if (!req.params.state) throw new Error("State undefined");

    const notificationsFound =
      await NotificationService.findNotificationsOfUserByState(
        req.params.state,
        validAuth.idUser
      );

    res.status(200).json(notificationsFound);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateStateNotification = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);
    if (!req.params.id) throw new Error("idNotification undefined");

    if (!req.body.newState) throw new Error("newState undefined");

    const notificationUpdated =
      await NotificationService.updateStateNotification(
        parseInt(req.params.id),
        req.body.newState,
        validAuth.idUser
      );

    res.status(200).json(notificationUpdated);
  } catch (error) {
    console.log(error);
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
