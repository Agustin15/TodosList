import { File } from "../model/fileModel.js";
const fileModel = new File();

export const FileService = {
  addFile: async (idTask, files) => {
    let errorAdded = false;
    for (const file of files) {
      let fileAdded = await fileModel.addFile(
        idTask,
        file.originalname,
        file.mimetype,
        file.buffer
      );
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
      let fileDeleted = await fileModel.deleteFile(file.idFile);
      if (fileDeleted == 0) {
        errorDeleted = true;
      }
    }

    if (errorDeleted) {
      throw new Error("Error to delete file");
    }

    return { result: true };
  },

  findFilesByIdTask: async (idTask) => {
    let filesTask = await fileModel.getFilesByIdTask(idTask);

    filesTask = filesTask.map((file) => {
      file.fileTask = file.fileTask.toString("base64");
      return file;
    });
    return filesTask;
  },

  findFilesChanged: async (idTask, filesUpdated) => {
    try {
      const filesTask = await FileService.findFilesByIdTask(idTask);
      let filesForAdd = FileService.searchFilesForAdd(
        idTask,
        filesUpdated,
        filesTask
      );
      let filesForDelete = FileService.searchFilesForDelete(
        idTask,
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
      const quantityFiles = await fileModel.getQuantityFilesByUser(idUser);
      return { quantityFiles: quantityFiles };
    } catch (error) {
      throw error;
    }
  },

  findLimitFilesByIdUser: async (idUser, offset) => {
    try {
      const filesFound = await fileModel.getFilesByUserLimit(idUser, offset);

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
