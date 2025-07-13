import connection from "../config/database.js";

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

  async post() {
    try {
      const [result] = await connection.execute(
        "INSERT INTO notifications (idTask,datetimeSend,state) values (?,?,?)",
        [this.propIdTask, this.propDatetimeSend, this.propState]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchStateNotification() {
    try {
      const [result] = await connection.execute(
        "update notifications set state=? where idNotification=?",
        [this.propState, this.propIdNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchDatetimeNotification() {
    try {
      const [result] = await connection.execute(
        "update notifications set datetimeSend=? where idNotification=?",
        [this.propDatetimeSend, this.propIdNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotificationByIdTask() {
    try {
      const [results] = await connection.execute(
        "select * from notifications where idTask=?",
        [this.propIdTask]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getNotificationsSentTasksUser(idUser) {
    try {
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
        "select * from notifications inner join tasks on notifications.idTask=tasks.idTask where tasks.idUser=? &&" +
          " notifications.state=?",
        [idUser, this.propState]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async delete() {
    try {
      const [result] = await connection.execute(
        "delete from notifications where idNotification=?",
        [this.propIdNotification]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
}
