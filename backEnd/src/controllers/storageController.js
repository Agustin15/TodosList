import { StorageService } from "../services/storageService.js";
import { authRequest } from "../auth/auth.js";

export const getStorageFilesUsedByUser = async (req, res) => {
  try {
    let validAuth = authRequest(req, res);

    const storageUsed = await StorageService.getStorageFilesUsedByUser(
      validAuth.idUser
    );

    res.status(200).json({ storageUsed });
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
