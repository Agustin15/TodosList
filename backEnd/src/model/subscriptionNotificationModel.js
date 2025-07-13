import connection from "../config/database.js";

export class SubscriptionNotification {
  #idNotification;
  #endpointURL;

  get propIdNotification() {
    return this.#idNotification;
  }

  set propIdNotification(value) {
    if (!value) throw new Error("Enter notification");
    this.#idNotification = value;
  }

  get propEndpointURL() {
    return this.#endpointURL;
  }

  set propEndpointURL(value) {
    if (!value || value.length == 0)
      throw new Error("Enter subscription endpoint");
    this.#endpointURL = value;
  }

  async post() {
    try {
      const [result] = await connection.execute(
        "INSERT INTO notifications_subscription (idNotification,endpointURL) values (?,?)",
        [this.propIdNotification, this.propEndpointURL]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getPendingNotificationsByEndpoint(state) {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription inner join notifications on notifications_subscription.idNotification" +
          "=notifications.idNotification where notifications_subscription.endpointURL=? and notifications.state=?",
        [this.propEndpointURL, state]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotificationSubscriptionByIdNotifi() {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription where idNotification=?",
        [this.propIdNotification]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getSubscriptionsDistinctByIdNotification() {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription where idNotification=? and endpointURL!=?",
        [this.propIdNotification, this.propEndpointURL]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
