import { Storage } from "../model/storageModel.js";
import { File } from "../model/fileModel.js";

export const StorageService = {
  getStorageFilesUsedByUser: async (idUser, connection) => {
    try {
      const fileModel = new File();
      const storageModel = new Storage(idUser, fileModel);

      const storageUsed =
        storageModel.calculateStorageFilesUsedByUser(connection);

      return storageUsed;
    } catch (error) {
      throw error;
    }
  }
};
