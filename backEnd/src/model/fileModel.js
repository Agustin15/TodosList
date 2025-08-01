import connection from "../config/database.js";
export class File {
  #idTask;
  #idFile;
  #nameFile;
  #typeFile;
  #file;
  #datetime;

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

  get propDatetime() {
    return this.#datetime;
  }

  set propDatetime(value) {
    if (new Date(value) == "Invalid Date") throw new Error("Invalid Date");
    this.#datetime = value;
  }

  async post() {
    try {
      const [result] = await connection.execute(
        "Insert into files (nameFile,typeFile,datetimeUpload,fileTask,idTask) values(?,?,CURRENT_TIME(),?,?)",
        [this.propNameFile, this.propTypeFile, this.propFile, this.propIdTask]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete() {
    try {
      const [result] = await connection.execute(
        "delete from files where idFile=?",
        [this.propIdFile]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getFilesByIdTask() {
    try {
      const [result] = await connection.execute(
        "select * from files where idTask=?",
        [this.propIdTask]
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getQuantityFilesByUser(idUser) {
    try {
      const [results] = await connection.execute(
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
      const [results] = await connection.execute(
        `select * from files inner join tasks on files.idTask=tasks.idTask where tasks.idUser=? order by 
        files.datetimeUpload desc LIMIT 10 OFFSET ${offset}`,
        [idUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllFilesUser(idUser) {
    try {
      const [results] = await connection.execute(
        "select files.fileTask from files inner join tasks on files.idTask=tasks.idTask where" +
          " tasks.idUser=?",
        [idUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
