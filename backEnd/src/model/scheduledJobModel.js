import { connectionMysql } from "../config/database.js";

export class ScheduledJob {
  #idNotification;

  get propIdNotification() {
    return this.#idNotification;
  }

  set propIdNotification(value) {
    if (typeof value != "number")
      throw new Error("Invalid idNotification,it must be a number");
    this.#idNotification = value;
  }

  async post() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "INSERT INTO scheduled_jobs (idNotification) values (?)",
        [this.propIdNotification]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getJobByIdNotification() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "select * from scheduled_jobs where idNotification=?",
        [this.propIdNotification]
      );

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
