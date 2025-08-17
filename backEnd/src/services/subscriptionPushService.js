import { SubscriptionPush } from "../model/subscripcionPushModel.js";
import { SubscriptionNotificationService } from "./subscriptionNotificationService.js";
import { NotificationService } from "./notificationService.js";
import { connectionMysql } from "../config/database.js";
const subscriptionPushModel = new SubscriptionPush();

export const SubscriptionPushService = {
  addSubscriptionUser: async (subscription, idUser) => {
    subscriptionPushModel.propIdUser = idUser;
    subscriptionPushModel.propEndpointURL = subscription.endpoint;
    subscriptionPushModel.propAuth = subscription.keys.auth;
    subscriptionPushModel.propKeyp256dh = subscription.keys.p256dh;

    try {
      const subscriptionAdded = await subscriptionPushModel.post();

      if (subscriptionAdded == 0) throw new Error("Failed to add subscription");

      return subscriptionAdded;
    } catch (error) {
      throw error;
    }
  },
  deleteSubscription: async (endpoint) => {
    try {
      await connectionMysql.connectionCreated.execute(
        "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE"
      );
      await connectionMysql.connectionCreated.beginTransaction();

      let notificationsPending =
        await SubscriptionNotificationService.findPendingNotificationsByEndpoint(
          endpoint
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

      subscriptionPushModel.propEndpointURL = endpoint;
      const deletedSubscription = await subscriptionPushModel.delete();

      if (deletedSubscription == 0)
        throw new Error("Failed to delete subscription");

      await connectionMysql.connectionCreated.commit();
      return deletedSubscription;
    } catch (error) {
      await connectionMysql.connectionCreated.rollback();
      throw error;
    }
  },
  getSubscriptionsByIdUser: async (idUser) => {
    try {
      subscriptionPushModel.propIdUser = idUser;
      const userSubscriptions =
        await subscriptionPushModel.getSubscriptionsByIdUser();
      return userSubscriptions;
    } catch (error) {
      throw error;
    }
  }
};
