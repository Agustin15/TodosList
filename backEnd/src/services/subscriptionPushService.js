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

      if (subscriptionAdded == 0)
        throw new Error("Failed to add subscription", { cause: { code: 500 } });

      return subscriptionAdded;
    } catch (error) {
      throw error;
    }
  },
  deleteSubscription: async (endpoint) => {
    let connection;
    try {
      let notificationsPending =
        await SubscriptionNotificationService.findPendingNotificationsByEndpoint(
          endpoint
        );

      connection = await connectionMysql.pool.getConnection();

      await connection.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      await connection.beginTransaction();

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
              notification.idNotification,
              connection
            );
            if (deleted == 0) {
              errorDelete = true;
              break;
            }
          }
        }

        if (errorDelete)
          throw new Error("Failed to delete pending notification", {
            cause: { code: 500 }
          });
      }

      subscriptionPushModel.propEndpointURL = endpoint;
      const deletedSubscription = await subscriptionPushModel.delete(
        connection
      );

      if (deletedSubscription == 0)
        throw new Error("Failed to delete subscription", {
          cause: { code: 500 }
        });

      await connection.commit();
      connection.release();

      return deletedSubscription;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },
  getSubscriptionsByIdUser: async (idUser, connection) => {
    try {
      subscriptionPushModel.propIdUser = idUser;
      const userSubscriptions =
        await subscriptionPushModel.getSubscriptionsByIdUser(connection);
      return userSubscriptions;
    } catch (error) {
      throw error;
    }
  }
};
