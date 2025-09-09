import { connectionMysql } from "../config/database.js";
export class Task {
  #idTask;
  #idUser;
  #icon;
  #descriptionTask;
  #dateTask;
  #isCompleted;

  get propIdUser() {
    return this.#idUser;
  }

  set propIdUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idUser = value;
  }

  get propIcon() {
    return this.#icon;
  }

  set propIcon(value) {
    if (typeof value != "string" || value.length == 0)
      throw new Error("Invalid icon, it must be a string");
    this.#icon = value;
  }
  get propDescription() {
    return this.#descriptionTask;
  }

  set propDescription(value) {
    if (typeof value != "string" || value.length == 0)
      throw new Error("Invalid description, it must be a string");
    this.#descriptionTask = value;
  }
  get propDatetime() {
    return this.#dateTask;
  }

  set propDatetime(value) {
    if (new Date(value) == "Invalid Date") throw new Error("Invalid Datetime");
    if (new Date(value).getTime() <= Date.now())
      throw new Error("Datetime task must be higher than datetime now");

    this.#dateTask = value;
  }

  get propIsCompleted() {
    return this.#isCompleted;
  }

  set propIsCompleted(value) {
    if (typeof value != "number" || (value != 0 && value != 1))
      throw new Error("Invalid state, it must be a number 0 or 1");
    this.#isCompleted = value;
  }
  get propIdTask() {
    return this.#idTask;
  }

  set propIdTask(value) {
    if (typeof value != "number")
      throw new Error("Invalid idTask, must be a number");
    this.#idTask = value;
  }

  async post(connection) {
    try {
      let sqlQuery =
        "INSERT INTO tasks (icon,descriptionTask,datetimeTask,isCompleted,idUser) VALUES (?,?,?,?,?)";

      let params = [
        this.propIcon,
        this.propDescription,
        this.propDatetime,
        this.propIsCompleted,
        this.propIdUser
      ];

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
  async put(connection) {
    try {
      let sqlQuery =
        "Update tasks set icon=?,descriptionTask=?,datetimeTask=?,isCompleted=? where idTask=?";

      let params = [
        this.propIcon,
        this.propDescription,
        this.propDatetime,
        this.propIsCompleted,
        this.propIdTask
      ];

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

  async patchStateTask() {
    try {
      const [result] = await connectionMysql.pool.query(
        "Update tasks set isCompleted=? where idTask=?",
        [this.propIsCompleted, this.propIdTask]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async delete(connection) {
    try {
      let sqlQuery = "delete from tasks where idTask=?";
      let param = [this.propIdTask];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, param);
        return result.affectedRows;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, param);
        return result.affectedRows;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksThisWeekByStateAndUser(firstSunday, nextSaturday) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && isCompleted=?
         ORDER BY datetimeTask desc`,
        [this.propIdUser, firstSunday, nextSaturday, this.propIsCompleted]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTasksThisWeekUser(firstSunday, nextSaturday) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? ORDER BY datetimeTask desc`,
        [this.propIdUser, firstSunday, nextSaturday]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksThisWeekByStateAndUserLimit(firstSunday, nextSaturday, index) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && isCompleted=? ORDER 
        BY datetimeTask desc LIMIT 10 OFFSET ${index} `,
        [this.propIdUser, firstSunday, nextSaturday, this.propIsCompleted]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTasksByWeekday(firstSunday, nextSaturday, weekday) {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && weekday(datetimeTask)=?",
        [this.propIdUser, firstSunday, nextSaturday, weekday]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTasksStateByWeekday(firstSunday, nextSaturday, weekday) {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && weekday(datetimeTask)=? && isCompleted=?",
        [
          this.propIdUser,
          firstSunday,
          nextSaturday,
          weekday,
          this.propIsCompleted
        ]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksLimitByFilterOption(year, month, index) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=? 
        order by datetimeTask desc LIMIT 10 OFFSET ${index}`,
        [this.propIdUser, year, month, this.propIsCompleted]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getQuantityTasksByFilterOption(year, month) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=?`,
        [this.propIdUser, year, month, this.propIsCompleted]
      );

      return results.length;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getQuantityTasksByMonthAndYear(month, year) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=?`,
        [this.propIdUser, year, month]
      );

      return results.length;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getQuantityTasksInYear(year) {
    try {
      const [result] = await connectionMysql.pool.query(
        `select COUNT(*) as average from tasks where idUser=? && YEAR(datetimeTask)=? `,
        [this.propIdUser, year]
      );

      return result[0].average;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTaskById(connection) {
    try {
      let sqlQuery = "select * from tasks where idUser=? && idTask=?";
      let params = [this.propIdUser, this.propIdTask];

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

  async getTaskRecentlyAdded(connection) {
    try {
      let sqlQuery =
        "select * from tasks where idUser=? && descriptionTask=? && datetimeTask=?";
      let params = [this.propIdUser, this.propDescription, this.propDatetime];
      
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
  async getYearsTask() {
    try {
      const [results] = await connectionMysql.pool.query(
        "select DISTINCT YEAR(datetimeTask) as year from tasks where idUser=?",
        [this.propIdUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllTasksByUser() {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from tasks where idUser=?",
        [this.propIdUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
