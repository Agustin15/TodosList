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

  async post(connection) {
    try {
      let sqlQuery = "INSERT INTO scheduled_jobs (idNotification) values (?)";
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
  async getJobByIdNotification(connection) {
    try {
      let sqlQuery = "select * from scheduled_jobs where idNotification=?";
      let params = [this.propIdNotification];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, params);
        return result;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, params);
        return result;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
