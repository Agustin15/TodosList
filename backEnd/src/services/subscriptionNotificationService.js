import { SubscriptionPush } from "../model/subscripcionPushModel.js";
import { Notification } from "../model/notificationModel.js";
const subscriptionPushModel = new SubscriptionPush();
const notificationModel = new Notification();

export const SubscriptionNotificationService = {
  findSubscriptionsDistinctByIdNotification: async (
    idNotification,
    endpointURL
  ) => {
    try {
      const subscriptions =
        await subscriptionPushModel.getSubscriptionsDistinctByIdNotification(
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
        await notificationModel.getPendingNotificationsByEndpoint(
          endpoint,
          state
        );

      return pendingNotifications;
    } catch (error) {
      throw new Error(error);
    }
  }
};
