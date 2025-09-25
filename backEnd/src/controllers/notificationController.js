import { NotificationService } from "../services/notificationService.js";
import { authRequest } from "../auth/auth.js";

export const getNotificationsSentTasksUser = async (req, res) => {
  try {
    let validAuth = authRequest(req, res);

    let notifications =
      await NotificationService.findNotificationsSentTasksUser(
        validAuth.idUser
      );

    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getNotificationsOfUserByState = async (req, res) => {
  try {
    let validAuth = authRequest(req, res);
    if (!req.params.state)
      throw new Error("State undefined", {
        cause: { code: 400 }
      });

    const notificationsFound =
      await NotificationService.findNotificationsOfUserByState(
        req.params.state,
        validAuth.idUser
      );

    res.status(200).json(notificationsFound);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const updateStateNotification = async (req, res) => {
  try {
    let validAuth = authRequest(req, res);
    if (!req.params.id)
      throw new Error("idNotification undefined", {
        cause: { code: 400 }
      });

    if (!req.body.newState)
      throw new Error("newState undefined", {
        cause: { code: 400 }
      });

    const notificationUpdated =
      await NotificationService.updateStateNotification(
        parseInt(req.params.id),
        req.body.newState,
        validAuth.idUser
      );

    res.status(200).json(notificationUpdated);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};
