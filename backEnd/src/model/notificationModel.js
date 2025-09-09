import { connectionMysql } from "../config/database.js";

export class Notification {
  #idNotification;
  #idTask;
  #datetimeSend;
  #state;

  get propIdNotification() {
    return this.#idNotification;
  }

  set propIdNotification(value) {
    if (typeof value != "number")
      throw new Error("Invalid idNotification,it must be a number");
    this.#idNotification = value;
  }
  get propIdTask() {
    return this.#idTask;
  }

  set propIdTask(value) {
    if (typeof value != "number")
      throw new Error("Invalid idTask,it must be a number");
    this.#idTask = value;
  }

  get propDatetimeSend() {
    return this.#datetimeSend;
  }

  set propDatetimeSend(value) {
    if (new Date(value) == "Invalid Date") throw new Error("Invalid Date");
    if (new Date(value).getTime() <= Date.now())
      throw new Error(
        "Datetime notification must be higher than current datetime"
      );

    this.#datetimeSend = value;
  }

  get propState() {
    return this.#state;
  }

  set propState(value) {
    if (!value || value.length == 0) throw new Error("Enter state");
    this.#state = value;
  }

  async post(connection) {
    try {
      let sqlQuery =
        "INSERT INTO notifications (datetimeSend,state,idTask) values (?,?,?)";
      let params = [this.propDatetimeSend, this.propState, this.propIdTask];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, params);
        return result.affectedRows;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, params);
        return result.affectedRows;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchStateNotification() {
    try {
      const [result] = await connectionMysql.pool.query(
        "update notifications set state=? where idNotification=?",
        [this.propState, this.propIdNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchDatetimeNotification(connection) {
    try {
      let sqlQuery =
        "update notifications set datetimeSend=? where idNotification=?";
      let params = [this.propDatetimeSend, this.propIdNotification];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, params);
        return result.affectedRows;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, params);
        return result.affectedRows;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotificationByIdTask(connection) {
    try {
      let sqlQuery = "select * from notifications where idTask=?";
      let params = [this.propIdTask];

      if (connection) {
        const [results] = await connection.execute(sqlQuery, params);
        return results;
      } else {
        const [results] = await connectionMysql.pool.query(sqlQuery, params);
        return results;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getNotificationsSentTasksUser(idUser) {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from notifications inner join tasks on notifications.idTask=tasks.idTask where tasks.idUser=? && notifications.state!=? order by notifications.datetimeSend desc",
        [idUser, this.propState]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotificationsOfUserByState(idUser) {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from notifications inner join tasks on notifications.idTask=tasks.idTask where tasks.idUser=? &&" +
          " notifications.state=?",
        [idUser, this.propState]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async delete(connection) {
    try {
      let sqlQuery = "delete from notifications where idNotification=?";
      let params = [this.propIdNotification];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, params);
        return result.affectedRows;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, params);
        return result.affectedRows;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
