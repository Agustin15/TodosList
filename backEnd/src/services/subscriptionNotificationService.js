import { SubscriptionNotification } from "../model/subscriptionNotificationModel.js";
const subscriptionNotificationModel = new SubscriptionNotification();

export const SubscriptionNotificationService = {
  addNotificationsSubscriptions: async (idNotification, subscriptions) => {
    let errorAdd = false;
    try {
      for (const subscription of subscriptions) {
        let notificationSubscriptionAdded =
          await subscriptionNotificationModel.post(
            idNotification,
            subscription.endpointURL
          );

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

  getNotificationSubscriptionByIdNotification: async (idNotification) => {
    try {
      let notification =
        await subscriptionNotificationModel.getNotificationSubscriptionByIdNotifi(
          idNotification
        );

      return notification;
    } catch (error) {
      throw new Error(error);
    }
  },
  findSubscriptionsDistinctByIdNotification: async (
    idNotification,
    endpointURL
  ) => {
    try {
      const subscriptions =
        await subscriptionNotificationModel.getSubscriptionsDistinctByIdNotification(
          idNotification,
          endpointURL
        );
      return subscriptions;
    } catch (error) {
      throw new Error(error);
    }
  },

  findPendingNotificationsByEndpoint: async (endpoint, state) => {
    try {
      let pendingNotifications =
        await subscriptionNotificationModel.getPendingNotificationsByEndpoint(
          endpoint,
          state
        );

      return pendingNotifications;
    } catch (error) {
      throw new Error(error);
    }
  }
};
