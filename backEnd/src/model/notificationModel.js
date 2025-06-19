import connection from "../config/database.js";

export class Notification {
  async addNotification(idTask, datetimeSend, state) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO notifications (idTask,datetimeSend,state) values (?,?,?)",
        [idTask, datetimeSend, state]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addNotificationSubscription(idNotification, endpointURL) {
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

  async updateStateNotification(idNotification, newState) {
    try {
      const [result] = await connection.execute(
        "update notifications set state=? where idNotification=?",
        [newState, idNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateDatetimeNotification(idNotification, datetimeSend) {
    try {
      const [result] = await connection.execute(
        "update notifications set datetimeSend=? where idNotification=?",
        [datetimeSend, idNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotificationByIdTask(idTask) {
    try {
      const [results] = await connection.execute(
        "select * from notifications where idTask=?",
        [idTask]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getPendingNotificationsByEndpoint(endpointURL, state) {
    try {
      const [results] = await connection.execute(
        "select * from notifications_subscription inner join notifications on notifications_subscription.idNotification" +
          "=notifications.idNotification where endpointURL=? and state=?",
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

  async deleteNotification(idNotification) {
    try {
      const [result] = await connection.execute(
        "delete from notifications where idNotification=?",
        [idNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
}
