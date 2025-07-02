import connection from "../config/database.js";

export class ScheduledJob {
  async post(idNotification) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO scheduledJob (idNotification) values (?)",
        [idNotification]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getJobByIdNotification(idNotification) {
    try {
      const [result] = await connection.execute(
        "select * from scheduledjob where idNotification=?",
        [idNotification]
      );

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
