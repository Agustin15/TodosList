import { FileModel } from "../model/fileModel.js";
export const addFile = async (idTask, files) => {
  let errorAdded = false;

  try {
    for (const file of files) {
      let fileAdded = await FileModel.addFile(
        idTask,
        file.originalname,
        file.mimetype,
        file.buffer
      );
      if (!fileAdded) {
        errorAdded = true;
      }
    }

    if (errorAdded) {
      throw new Error("Error al agregar archivo");
    }

    return { result: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteFile = async (files) => {
  let errorDeleted = false;

  try {
    for (const file of files) {
      let fileDeleted = await FileModel.deleteFile(file.idFile);
      if (!fileDeleted) {
        errorDeleted = true;
      }
    }

    if (errorDeleted) {
      throw new Error("Error al eliminar archivo");
    }

    return { result: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findFilesByIdTask = async (idTask) => {
  try {
    let filesTask = await FileModel.getFilesByIdTask(idTask);
    filesTask = filesTask.map((file) => {
      file.fileTask = file.fileTask.toString("base64");
      return file;
    });
    return filesTask;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findFilesChanged = async (idTask, filesUpdated) => {
  try {
    const filesTask = await findFilesByIdTask(idTask);
    let filesForAdd = searchFilesForAdd(idTask, filesUpdated, filesTask);
    let filesForDelete = searchFilesForDelete(idTask, filesUpdated, filesTask);

    return { filesForAdd: filesForAdd, filesForDelete: filesForDelete };
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchFilesForAdd = (idTask, filesUpdated, filesTask) => {
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
};

const searchFilesForDelete = (idTask, filesUpdated, filesTask) => {
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
};
