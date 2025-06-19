import { authRequest } from "../auth/auth.js";
import { File } from "../model/fileModel.js";

const fileModel = new File();
export const addFile = async (idTask, files) => {
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
};

export const deleteFile = async (files) => {
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
};

export const findFilesByIdTask = async (idTask) => {
  let filesTask = await fileModel.getFilesByIdTask(idTask);

  filesTask = filesTask.map((file) => {
    file.fileTask = file.fileTask.toString("base64");
    return file;
  });
  return filesTask;
};

export const findFilesChanged = async (idTask, filesUpdated) => {
  try {
    const filesTask = await findFilesByIdTask(idTask);
    let filesForAdd = searchFilesForAdd(idTask, filesUpdated, filesTask);
    let filesForDelete = searchFilesForDelete(idTask, filesUpdated, filesTask);

    return { filesForAdd: filesForAdd, filesForDelete: filesForDelete };
  } catch (error) {
    throw new Error(error);
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

export const findQuantityFilesByIdUser = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);

    if (!validAuth.idUser) {
      throw new Error("idUser undefined");
    }

    const quantityFiles = await fileModel.getQuantityFilesByUser(
      validAuth.idUser
    );

    res.status(200).json({ quantityFiles: quantityFiles });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const findLimitFilesByIdUser = async (req, res) => {
  try {
    const { offset } = JSON.parse(req.params.getFilesParams);

    if (offset == null) {
      throw new Error("offset undefined");
    }

    let validAuth = await authRequest(req, res);

    if (!validAuth.idUser) {
      throw new Error("idUser undefined");
    }

    const filesFound = await fileModel.getFilesByUserLimit(
      validAuth.idUser,
      offset
    );

    let files = filesFound.map((file) => {
      file.fileTask = file.fileTask.toString("base64");
      return file;
    });

    res.status(200).json(files);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
