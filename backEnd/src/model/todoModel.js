import connection from "../config/database.js";
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
    if (new Date(value).getTime() <= new Date().getTime())
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

  async post() {
    try {
      const [result] = await connection.execute(
        "INSERT INTO tasks (idUser,icon,descriptionTask,datetimeTask,isCompleted) VALUES (?,?,?,?,?)",
        [
          this.propIdUser,
          this.propIcon,
          this.propDescription,
          this.propDatetime,
          this.propIsCompleted
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async put() {
    try {
      const [result] = await connection.execute(
        "Update tasks set icon=?,descriptionTask=?,datetimeTask=?,isCompleted=? where idTask=?",
        [
          this.propIcon,
          this.propDescription,
          this.propDatetime,
          this.propIsCompleted,
          this.propIdTask
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchStateTask() {
    try {
      const [result] = await connection.execute(
        "Update tasks set isCompleted=? where idTask=?",
        [this.propIsCompleted, this.propIdTask]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async delete() {
    try {
      const [result] = await connection.execute(
        "delete from tasks where idTask=?",
        [this.propIdTask]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksThisWeekByStateAndUser(firstSunday, nextSaturday) {
    try {
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=? LIMIT 10 OFFSET ${index} `,
        [this.propIdUser, year, month, this.propIsCompleted]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getQuantityTasksByFilterOption(year, month) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=?`,
        [this.propIdUser, year, month, this.propIsCompleted]
      );

      return results.length;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTaskById() {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && idTask=?",
        [this.propIdUser, this.propIdTask]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTaskRecentlyAdded() {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && descriptionTask=? && datetimeTask=?",
        [this.propIdUser, this.propDescription, this.propDatetime]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getYearsTask() {
    try {
      const [results] = await connection.execute(
        "select DISTINCT YEAR(datetimeTask) from tasks where idUser=?",
        [this.propIdUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllTasksByUser() {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=?",
        [this.propIdUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
