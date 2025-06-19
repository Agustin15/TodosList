import connection from "../config/database.js";

export class File {
  async addFile(idTask, nameFile, typeFile, file) {
    try {
      const [result] = await connection.execute(
        "Insert into files (idTask,nameFile,typeFile,datetimeUpload,fileTask) values(?,?,?,CURRENT_TIME(),?)",
        [idTask, nameFile, typeFile, file]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteFile(idFile) {
    try {
      const [result] = await connection.execute(
        "delete from files where idFile=?",
        [idFile]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getFilesByIdTask(idTask) {
    try {
      const [result] = await connection.execute(
        "select * from files where idTask=?",
        [idTask]
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

  async getFilesByUserLimit(idUser, offset) {
    try {
      const [results] = await connection.execute(
        `select * from files inner join tasks on files.idTask=tasks.idTask where tasks.idUser=? LIMIT 10 OFFSET ${offset}`,
        [idUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
