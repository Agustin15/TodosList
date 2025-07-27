import { Storage } from "../model/storageModel.js";
import { FileService } from "./fileService.js";

export const StorageService = {
  getStorageFilesUsedByUser: async (idUser) => {
    try {
      const filesUser = await FileService.findAllFilesUser(idUser);
      const storageModel = new Storage(idUser, filesUser);

      const storageUsed = storageModel.calculateStorageFilesUsedByUser();

      return storageUsed;
    } catch (error) {
      throw error;
    }
  }
};
