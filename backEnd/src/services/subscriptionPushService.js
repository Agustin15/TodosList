import { SubscriptionPush } from "../model/subscripcionPushModel.js";
import { SubscriptionNotificationService } from "./subscriptionNotificationService.js";
import { NotificationService } from "./notificationService.js";

import connection from "../config/database.js";
const subscriptionPushModel = new SubscriptionPush();

export const SubscriptionPushService = {
  addSubscriptionUser: async (subscription, idUser) => {
    try {
      const subscriptionAdded = await subscriptionPushModel.addSubscriptionUser(
        idUser,
        subscription.endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth
      );

      if (subscriptionAdded == 0) throw new Error("Failed to add subscription");

      return subscriptionAdded;
    } catch (error) {
      throw error;
    }
  },
  deleteSubscription: async (endpoint) => {
    try {
      connection.beginTransaction();

      let notificationsPending =
        await SubscriptionNotificationService.findPendingNotificationsByEndpoint(
          endpoint,
          "pending"
        );

      if (notificationsPending.length > 0) {
        let errorDelete = false;

        for (const notification of notificationsPending) {
          let subscriptions =
            await SubscriptionNotificationService.findSubscriptionsDistinctByIdNotification(
              notification.idNotification,
              endpoint
            );

          if (subscriptions.length == 0) {
            let deleted = await NotificationService.deleteNotification(
              notification.idNotification
            );
            if (deleted == 0) {
              errorDelete = true;
              break;
            }
          }
        }

        if (errorDelete)
          throw new Error("Failed to delete pending notification");
      }

      const deletedSubscription =
        await subscriptionPushModel.deleteSubscription(endpoint);

      if (deletedSubscription == 0)
        throw new Error("Failed to delete subscription");

      connection.commit();
      return deletedSubscription;
    } catch (error) {
      throw error;
    }
  },
  getSubscriptionsByIdUser: async (idUser) => {
    const userSubscriptions =
      await subscriptionPushModel.getSubscriptionsByIdUser(idUser);
    return userSubscriptions;
  }
};
