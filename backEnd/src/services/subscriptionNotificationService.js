import { SubscriptionNotification } from "../model/subscriptionNotificationModel.js";
const subscriptionNotificationModel = new SubscriptionNotification();

export const SubscriptionNotificationService = {
  addNotificationsSubscriptions: async (notification, subscriptions) => {
    let errorAdd = false;
    try {
      for (const subscription of subscriptions) {
        subscriptionNotificationModel.propNotification = notification;
        subscriptionNotificationModel.propEndpointURL =
          subscription.endpointURL;

        let notificationSubscriptionAdded =
          await subscriptionNotificationModel.post();

        if (notificationSubscriptionAdded == 0) {
          errorAdd = true;
          break;
        }
      }

      if (errorAdd)
        throw new Error("Failed to add notification of subscription");
    } catch (error) {
      throw error;
    }
  },

  getNotificationSubscriptionByIdNotification: async (notification) => {
    try {
      subscriptionNotificationModel.propNotification = notification;
      let notificationOfSubscription =
        await subscriptionNotificationModel.getNotificationSubscriptionByIdNotifi();

      return notificationOfSubscription;
    } catch (error) {
      throw new Error(error);
    }
  },
  findSubscriptionsDistinctByIdNotification: async (
    notification,
    endpointURL
  ) => {
    try {
      subscriptionNotificationModel.propNotification = notification;
      subscriptionNotificationModel.propEndpointURL = endpointURL;
      const subscriptions =
        await subscriptionNotificationModel.getSubscriptionsDistinctByIdNotification();
      return subscriptions;
    } catch (error) {
      throw new Error(error);
    }
  },

  findPendingNotificationsByEndpoint: async (endpoint, notification) => {
    try {
      subscriptionNotificationModel.propNotification = notification;
      subscriptionNotificationModel.propEndpointURL = endpoint;
      let pendingNotifications =
        await subscriptionNotificationModel.getPendingNotificationsByEndpoint();

      return pendingNotifications;
    } catch (error) {
      throw new Error(error);
    }
  }
};
