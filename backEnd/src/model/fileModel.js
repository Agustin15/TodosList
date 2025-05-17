import connection from "../config/database.js";

export const FileModel = {
  addFile: async function (idTask, nameFile, typeFile, file) {
    try {
      const [result] = await connection.execute(
        "Insert into files (idTask,nameFile,typeFile,datetimeUpload,fileTask) values(?,?,?,CURRENT_TIME(),?)",
        [idTask, nameFile, typeFile, file]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteFile: async function (idFile) {
    try {
      const [result] = await connection.execute(
        "delete from files where idFile=?",
        [idFile]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getFilesByIdTask: async function (idTask) {
    try {
      const [result] = await connection.execute(
        "select * from files where idTask=?",
        [idTask]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
