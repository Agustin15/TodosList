import { Storage } from "../model/storageModel.js";
import { File } from "../model/fileModel.js";

export const StorageService = {
  getStorageFilesUsedByUser: async (idUser) => {
    try {
      const fileModel = new File();
      const storageModel = new Storage(idUser, fileModel);

      const storageUsed = storageModel.calculateStorageFilesUsedByUser();

      return storageUsed;
    } catch (error) {
      throw error;
    }
  }
};
