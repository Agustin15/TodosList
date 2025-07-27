import { StorageService } from "../services/storageService.js";
import { authRequest } from "../auth/auth.js";

export const getStorageFilesUsedByUser = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);

    const storageUsed = await StorageService.getStorageFilesUsedByUser(
      validAuth.idUser
    );

    res.status(200).json({ storageUsed });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
