import { authRequest } from "../auth/auth.js";
import { FileService } from "../services/fileService.js";

export const findQuantityFilesByIdUser = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);

    const quantityFiles = await FileService.findQuantityFilesByIdUser(
      validAuth.idUser
    );

    res.status(200).json(quantityFiles);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const findLimitFilesByIdUser = async (req, res) => {
  try {
    let validAuth = await authRequest(req, res);
    const { offset } = JSON.parse(req.params.getFilesParams);
    if (typeof offset === "undefined") {
      throw new Error("Offset undefined");
    }

    const files = await FileService.findLimitFilesByIdUser(
      validAuth.idUser,
      offset
    );

    res.status(200).json(files);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
