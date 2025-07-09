import { File } from "../model/fileModel.js";
const fileModel = new File();

export const FileService = {
  addFile: async (task, files) => {
    let errorAdded = false;
    for (const file of files) {
      fileModel.propFile = file.buffer;
      fileModel.propNameFile = file.originalname;
      fileModel.propTypeFile = file.mimetype;
      fileModel.propTask = task;

      let fileAdded = await fileModel.post();

      if (fileAdded == 0) {
        errorAdded = true;
      }
    }

    if (errorAdded) {
      throw new Error("Error to add file");
    }

    return { result: true };
  },

  deleteFile: async (files) => {
    let errorDeleted = false;

    for (const file of files) {
      fileModel.propIdFile = file.idFile;
      let fileDeleted = await fileModel.delete();
      if (fileDeleted == 0) {
        errorDeleted = true;
      }
    }

    if (errorDeleted) {
      throw new Error("Error to delete file");
    }

    return { result: true };
  },

  findFilesByIdTask: async (task) => {
    fileModel.propTask = task;
    let filesTask = await fileModel.getFilesByIdTask();

    filesTask = filesTask.map((file) => {
      file.fileTask = file.fileTask.toString("base64");
      return file;
    });
    return filesTask;
  },

  findFilesChanged: async (task, filesUpdated) => {
    try {
      const filesTask = await FileService.findFilesByIdTask(task);
      let filesForAdd = FileService.searchFilesForAdd(
        task.idTask,
        filesUpdated,
        filesTask
      );
      let filesForDelete = FileService.searchFilesForDelete(
        task.idTask,
        filesUpdated,
        filesTask
      );

      return { filesForAdd: filesForAdd, filesForDelete: filesForDelete };
    } catch (error) {
      throw new Error(error);
    }
  },

  searchFilesForAdd: (idTask, filesUpdated, filesTask) => {
    let filesForAdd = filesUpdated.filter((file) => {
      let fileFound = filesTask.find(
        (fileTask) =>
          fileTask.idTask == idTask && fileTask.nameFile == file.originalname
      );
      if (!fileFound) {
        return file;
      }
    });
    return filesForAdd;
  },

  searchFilesForDelete: (idTask, filesUpdated, filesTask) => {
    let filesForDelete = filesTask.filter((file) => {
      let fileFound = filesUpdated.find(
        (fileUpdated) =>
          idTask == file.idTask && fileUpdated.originalname == file.nameFile
      );

      if (!fileFound) {
        return file;
      }
    });
    return filesForDelete;
  },

  findQuantityFilesByIdUser: async (idUser) => {
    try {
      fileModel.propTask = { idUser: idUser };
      const quantityFiles = await fileModel.getQuantityFilesByUser();
      return { quantityFiles: quantityFiles };
    } catch (error) {
      throw error;
    }
  },

  findLimitFilesByIdUser: async (idUser, offset) => {
    try {
      fileModel.propTask = { idUser: idUser };
      const filesFound = await fileModel.getFilesByUserLimit(offset);

      let files = filesFound.map((file) => {
        file.fileTask = file.fileTask.toString("base64");
        return file;
      });

      return files;
    } catch (error) {
      throw error;
    }
  }
};
