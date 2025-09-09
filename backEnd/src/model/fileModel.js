import { connectionMysql } from "../config/database.js";
export class File {
  #idTask;
  #idFile;
  #nameFile;
  #typeFile;
  #file;

  get propIdFile() {
    return this.#idFile;
  }

  set propIdFile(value) {
    if (typeof value != "number")
      throw new Error("Invalid idFile,it must be a number");
    this.#idFile = value;
  }

  get propIdTask() {
    return this.#idTask;
  }

  set propIdTask(value) {
    if (typeof value != "number")
      throw new Error("Invalid idTask,it must be a number");
    this.#idTask = value;
  }

  get propNameFile() {
    return this.#nameFile;
  }

  set propNameFile(value) {
    if (value.length == 0) throw new Error("Enter a name file");
    this.#nameFile = value;
  }

  get propTypeFile() {
    return this.#typeFile;
  }

  set propTypeFile(value) {
    if (value.length == 0) throw new Error("Enter a type file");
    this.#typeFile = value;
  }

  get propFile() {
    return this.#file;
  }

  set propFile(value) {
    if (!value) throw new Error("Enter a file");
    this.#file = value;
  }

  async post(connection) {
    try {
      let sqlQuery =
        "Insert into files (nameFile,typeFile,fileTask,idTask) values(?,?,?,?)";
      let params = [
        this.propNameFile,
        this.propTypeFile,
        this.propFile,
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

  async delete(connection) {
    try {
      let sqlQuery = "delete from files where idFile=?";
      let params = [this.propIdFile];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, params);
        return result.affectedRows;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, params);
        return result.affectedRows;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getFilesByIdTask(connection) {
    try {
      let sqlQuery = "select * from files where idTask=?";
      let params = [this.propIdTask];

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

  async getQuantityFilesByUser(idUser) {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from files inner join tasks on files.idTask=tasks.idTask where tasks.idUser=?",
        [idUser]
      );
      return results.length;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFilesByUserLimit(offset, idUser) {
    try {
      const [results] = await connectionMysql.pool.query(
        `select * from files inner join tasks on files.idTask=tasks.idTask where tasks.idUser=? order by 
        files.datetimeUpload desc LIMIT 10 OFFSET ${offset}`,
        [idUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllFilesUser(idUser, connection) {
    try {
      let sqlQuery =
        "select files.fileTask from files inner join tasks on files.idTask=tasks.idTask where" +
        " tasks.idUser=?";
      let params = [idUser];

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
}
