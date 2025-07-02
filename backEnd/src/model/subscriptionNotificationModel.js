import connection from "../config/database.js";

export class SubscriptionNotification {
  async post(idNotification, endpointURL) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO notifications_subscription (idNotification,endpointURL) values (?,?)",
        [idNotification, endpointURL]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getPendingNotificationsByEndpoint(endpointURL, state) {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription inner join notifications on notifications_subscription.idNotification" +
          "=notifications.idNotification where notifications_subscription.endpointURL=? and notifications.state=?",
        [endpointURL, state]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotificationSubscriptionByIdNotifi(idNotification) {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription where idNotification=?",
        [idNotification]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getSubscriptionsDistinctByIdNotification(idNotification, endpointURL) {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription where idNotification=? and endpointURL!=?",
        [idNotification, endpointURL]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
 
}
