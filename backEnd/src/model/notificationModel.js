import connection from "../config/database.js";

export class Notification {
  async post(idTask, datetimeSend, state) {
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

  async patchStateNotification(idNotification, newState) {
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

  async patchDatetimeNotification(idNotification, datetimeSend) {
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
  async getNotificationsSentTasksUser(idUser, stateNotification) {
    try {
      const [results] = await connection.execute(
        "select * from notifications inner join tasks on notifications.idTask=tasks.idTask where tasks.idUser=? &&" +
          " notifications.state!=? order by notifications.datetimeSend desc",
        [idUser, stateNotification]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(idNotification) {
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
