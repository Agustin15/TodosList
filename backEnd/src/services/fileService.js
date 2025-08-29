import { File } from "../model/fileModel.js";
import { StorageService } from "./storageService.js";
const fileModel = new File();

export const FileService = {
  addFile: async (idTask, files) => {
    let errorAdded = false;
    for (const file of files) {
      fileModel.propFile = file.buffer;
      fileModel.propNameFile = file.originalname;
      fileModel.propTypeFile = file.mimetype;
      fileModel.propIdTask = idTask;

      let fileAdded = await fileModel.post();

      if (fileAdded == 0) {
        errorAdded = true;
      }
    }

    if (errorAdded) {
      throw new Error("Error to add file", { cause: { code: 500 } });
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
      throw new Error("Error to delete file",{ cause: { code: 500 } });
    }

    return { result: true };
  },

  findFilesByIdTask: async (idTask) => {
    fileModel.propIdTask = idTask;
    let filesTask = await fileModel.getFilesByIdTask();

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
      const filesFound = await fileModel.getFilesByUserLimit(offset, idUser);

      let files = filesFound.map((file) => {
        file.fileTask = file.fileTask.toString("base64");
        return file;
      });

      return files;
    } catch (error) {
      throw error;
    }
  },

  verifyAmountSizeOfFiles: async (files, idUser) => {
    const amountSize = files.reduce((ac, file) => {
      return (ac += file.size);
    }, 0);

    if (amountSize > 10 * Math.pow(10, 6))
      throw new Error("Limit amount size of 10MB of files exceeded",{ cause: { code: 500 } });

    const storageUsedUser = await StorageService.getStorageFilesUsedByUser(
      idUser
    );

    if (storageUsedUser.bytesUsed + amountSize > storageUsedUser.limitSize)
      throw new Error("This amount size files exceed your limit storage",{ cause: { code: 400 } });
  },

  findAllFilesUser: async (idUser) => {
    try {
      const allFilesOfUser = await fileModel.getAllFilesUser(idUser);

      return allFilesOfUser;
    } catch (error) {
      throw new Error(error);
    }
  }
};
