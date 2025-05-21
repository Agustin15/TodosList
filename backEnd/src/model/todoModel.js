import connection from "../config/database.js";

export const TaskModel = {
  addTask: async function (
    idUser,
    icon,
    descriptionTask,
    dateTask,
    isCompleted
  ) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO tasks (idUser,icon,descriptionTask,datetimeTask,isCompleted) VALUES (?,?,?,?,?)",
        [idUser, icon, descriptionTask, dateTask, isCompleted]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateTask: async function (
    icon,
    descriptionTask,
    dateTask,
    isCompleted,
    idTask
  ) {
    try {
      const [result] = await connection.execute(
        "Update tasks set icon=?,descriptionTask=?,datetimeTask=?,isCompleted=? where idTask=?",
        [icon, descriptionTask, dateTask, isCompleted, idTask]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateStateTask: async function (newState, idTask) {
    try {
      const [result] = await connection.execute(
        "Update tasks set isCompleted=? where idTask=?",
        [newState, idTask]
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteTask: async function (idTask) {
    try {
      const [result] = await connection.execute(
        "delete from tasks where idTask=?",
        [idTask]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getTasksThisWeekUser: async function (idUser, firstSunday, nextSaturday) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=?",
        [idUser, firstSunday, nextSaturday]
      );

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getTasksThisWeekUserLimit: async function (
    idUser,
    firstSunday,
    nextSaturday,
    index
  ) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? LIMIT 10 OFFSET ${index} `,
        [idUser, firstSunday, nextSaturday]
      );

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getTasksByWeekday: async function (
    idUser,
    firstSunday,
    nextSaturday,
    weekday
  ) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && datetimeTask>=? && datetimeTask<=? && weekday(datetimeTask)=?",
        [idUser, firstSunday, nextSaturday, weekday]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getTasksStateByWeekday: async function (
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
      throw new Error(error.message);
    }
  },
  getTasksLimitByFilterOption: async function (
    idUser,
    year,
    month,
    state,
    index
  ) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=? LIMIT 10 OFFSET ${index} `,
        [idUser, year, month, state]
      );

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getQuantityTasksByFilterOption: async function (idUser, year, month, state) {
    try {
      const [results] = await connection.execute(
        `select * from tasks where idUser=? && YEAR(datetimeTask)=? && MONTH(datetimeTask)=? && isCompleted=?`,
        [idUser, year, month, state]
      );

      return results.length;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getTaskById: async function (idUser,idTask) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && idTask=?",
        [idUser,idTask]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getTaskRecentlyAdded: async function (idUser, descriptionTask, datetimeTask) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=? && descriptionTask=? && datetimeTask=?",
        [idUser, descriptionTask, datetimeTask]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getYearsTask: async function (idUser) {
    try {
      const [results] = await connection.execute(
        "select DISTINCT YEAR(datetimeTask) from tasks where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getAllTasksByUser: async function (idUser) {
    try {
      const [results] = await connection.execute(
        "select * from tasks where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
