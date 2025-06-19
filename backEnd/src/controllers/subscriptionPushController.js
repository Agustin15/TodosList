import { SubscriptionPush } from "../model/subscripcionPushModel.js";
import { authRequest } from "../auth/auth.js";
import {
  deleteNotification,
  findPendingNotificationsByEndpoint
} from "./notificationsController.js";

import connection from "../config/database.js";

const subscriptionPush = new SubscriptionPush();

export const addSubscriptionUser = async (req, res) => {
  try {
    if (!req.body.subscription) {
      throw new Error("subscription undefined");
    }

    const subscription = req.body.subscription;

    const validAuthenticacion = await authRequest(req, res);

    const subscriptionAdded = await subscriptionPush.addSubscriptionUser(
      validAuthenticacion.idUser,
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth
    );

    if (subscriptionAdded == 0) throw new Error("Failed to add subscription");

    res.status(201).json(subscriptionAdded);
  } catch (error) {
       let errorCodeResponse = error.message.includes("Authentication") ? 401 : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    let paramDelete = JSON.parse(req.params.paramDelete);
    if (!paramDelete.endpoint)
      throw new Error("endpoint subscription undefined");

    let endpoint = decodeURIComponent(paramDelete.endpoint);

    await authRequest(req, res);

    connection.beginTransaction();

    let notificationsPending = await findPendingNotificationsByEndpoint(
      endpoint,
      "pending"
    );

    if (notificationsPending.length > 0) {
      let errorDelete = false;

      for (const notification of notificationsPending) {
        let subscriptions = await findSubscriptionsDistinctByIdNotification(
          notification.idNotification,
          endpoint
        );

        if (subscriptions.length == 0) {
          let deleted = await deleteNotification(notification.idNotification);
          if (deleted == 0) {
            errorDelete = true;
            break;
          }
        }
      }

      if (errorDelete) throw new Error("Failed to delete pending notification");
    }

    const deletedSubscription = await subscriptionPush.deleteSubscription(
      endpoint
    );

    if (deletedSubscription == 0)
      throw new Error("Failed to delete subscription");

    connection.commit();
    res.status(200).json(deletedSubscription);
  } catch (error) {
    connection.rollback();
     let errorCodeResponse = error.message.includes("Authentication") ? 401 : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
export const getSubscriptionsByIdUser = async (idUser) => {
  const userSubscriptions = await subscriptionPush.getSubscriptionsByIdUser(
    idUser
  );
  return userSubscriptions;
};

const findSubscriptionsDistinctByIdNotification = async (
  idNotification,
  endpointURL
) => {
  try {
    const subscriptions =
      await subscriptionPush.getSubscriptionsDistinctByIdNotification(
        idNotification,
        endpointURL
      );
    return subscriptions;
  } catch (error) {
    throw new Error(error);
  }
};
