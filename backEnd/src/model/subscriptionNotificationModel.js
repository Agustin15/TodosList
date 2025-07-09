import connection from "../config/database.js";

export class SubscriptionNotification {
  #notification;
  #endpointURL;

 
  get propNotification() {
    return this.#notification;
  }

  set propNotification(value) {
    if (!value) throw new Error("Enter notification");
    this.#notification = value;
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
        [this.propNotification.idNotification, this.propEndpointURL]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getPendingNotificationsByEndpoint() {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription inner join notifications on notifications_subscription.idNotification" +
          "=notifications.idNotification where notifications_subscription.endpointURL=? and notifications.state=?",
        [this.propEndpointURL, this.propNotification.state]
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
        [this.propNotification.idNotification]
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
        [this.propNotification.idNotification, this.propEndpointURL]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
