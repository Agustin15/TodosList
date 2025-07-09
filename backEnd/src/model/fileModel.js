import connection from "../config/database.js";
export class File {
  #task;
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

  get propTask() {
    return this.#task;
  }

  set propTask(value) {
    if (!value) throw new Error("Enter task");
    this.#task = value;
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
        "Insert into files (idTask,nameFile,typeFile,datetimeUpload,fileTask) values(?,?,?,CURRENT_TIME(),?)",
        [
          this.propTask.idTask,
          this.propNameFile,
          this.propTypeFile,
          this.propDatetime,
          this.propFile
        ]
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
        [this.propTask.idTask]
      );
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getQuantityFilesByUser() {
    try {
      const [results] = await connection.execute(
        "select * from files inner join tasks on files.idTask=tasks.idTask where tasks.idUser=?",
        [this.propTask.idUser]
      );
      return results.length;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFilesByUserLimit(offset) {
    try {
      const [results] = await connection.execute(
        `select * from files inner join tasks on files.idTask=tasks.idTask where tasks.idUser=? LIMIT 10 OFFSET ${offset}`,
        [this.propTask.idUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
