import { SubscriptionNotification } from "../model/subscriptionNotificationModel.js";
const subscriptionNotificationModel = new SubscriptionNotification();

export const SubscriptionNotificationService = {
  addNotificationsSubscriptions: async (
    idNotification,
    subscriptions,
    connection
  ) => {
    let errorAdd = false;

    try {
      for (const subscription of subscriptions) {
        subscriptionNotificationModel.propIdNotification = idNotification;
        subscriptionNotificationModel.propEndpointURL =
          subscription.endpointURL;

        let notificationSubscriptionAdded =
          await subscriptionNotificationModel.post(connection);

        if (notificationSubscriptionAdded == 0) {
          errorAdd = true;
          break;
        }
      }

      if (errorAdd)
        throw new Error("Failed to add notification of subscription", {
          cause: { code: 404 }
        });
    } catch (error) {
      throw error;
    }
  },

  getNotificationSubscriptionByIdNotification: async (idNotification) => {
    try {
      subscriptionNotificationModel.propIdNotification = idNotification;
      let notificationOfSubscription =
        await subscriptionNotificationModel.getNotificationSubscriptionByIdNotifi();

      return notificationOfSubscription;
    } catch (error) {
      throw new Error(error);
    }
  },
  findSubscriptionsDistinctByIdNotification: async (
    idNotification,
    endpointURL
  ) => {
    try {
      subscriptionNotificationModel.propIdNotification = idNotification;
      subscriptionNotificationModel.propEndpointURL = endpointURL;
      const subscriptions =
        await subscriptionNotificationModel.getSubscriptionsDistinctByIdNotification();
      return subscriptions;
    } catch (error) {
      throw new Error(error);
    }
  },

  findPendingNotificationsByEndpoint: async (endpoint) => {
    try {
      subscriptionNotificationModel.propEndpointURL = endpoint;
      let pendingNotifications =
        await subscriptionNotificationModel.getPendingNotificationsByEndpoint(
          "pending"
        );

      return pendingNotifications;
    } catch (error) {
      throw new Error(error);
    }
  }
};
