import connection from "../config/database.js";
export class Task {
  async addTask(idUser, icon, descriptionTask, dateTask, isCompleted) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO tasks (idUser,icon,descriptionTask,datetimeTask,isCompleted) VALUES (?,?,?,?,?)",
        [idUser, icon, descriptionTask, dateTask, isCompleted]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateTask(icon, descriptionTask, dateTask, isCompleted, idTask) {
    try {
      const [result] = await connection.execute(
        "Update tasks set icon=?,descriptionTask=?,datetimeTask=?,isCompleted=? where idTask=?",
        [icon, descriptionTask, dateTask, isCompleted, idTask]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateStateTask(newState, idTask) {
    try {
      const [result] = await connection.execute(
        "Update tasks set isCompleted=? where idTask=?",
        [newState, idTask]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteTask(idTask) {
    try {
      const [result] = await connection.execute(
        "delete from tasks where idTask=?",
        [idTask]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksThisWeekUser(idUser, firstSunday, nextSaturday) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? ORDER BY datetimeTask desc",
        [idUser, firstSunday, nextSaturday]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksThisWeekUserLimit(idUser, firstSunday, nextSaturday, index) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? ORDER BY datetimeTask desc LIMIT 10 OFFSET ${index}  `,
        [idUser, firstSunday, nextSaturday]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTasksByWeekday(idUser, firstSunday, nextSaturday, weekday) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && weekday(datetimeTask)=?",
        [idUser, firstSunday, nextSaturday, weekday]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTasksStateByWeekday(
    idUser,
    firstSunday,
    nextSaturday,
    weekday,
    state
  ) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && weekday(datetimeTask)=? && isCompleted=?",
        [idUser, firstSunday, nextSaturday, weekday, state]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getTasksLimitByFilterOption(idUser, year, month, state, index) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=? LIMIT 10 OFFSET ${index} `,
        [idUser, year, month, state]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getQuantityTasksByFilterOption(idUser, year, month, state) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=?`,
        [idUser, year, month, state]
      );

      return results.length;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTaskById(idUser, idTask) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && idTask=?",
        [idUser, idTask]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTaskRecentlyAdded(idUser, descriptionTask, datetimeTask) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && descriptionTask=? && datetimeTask=?",
        [idUser, descriptionTask, datetimeTask]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getYearsTask(idUser) {
    try {
      const [results] = await connection.execute(
        "select DISTINCT YEAR(datetimeTask) from tasks where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllTasksByUser(idUser) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
