import { authRequest } from "../auth/auth.js";
import { FileService } from "../services/fileService.js";

export const findQuantityFilesByIdUser = async (req, res) => {
  try {
    let validAuth = authRequest(req, res);

    const quantityFiles = await FileService.findQuantityFilesByIdUser(
      validAuth.idUser
    );

    res.status(200).json(quantityFiles);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const findLimitFilesByIdUser = async (req, res) => {
  try {
    let validAuth = authRequest(req, res);
    const { offset } = JSON.parse(req.params.getFilesParams);
    if (typeof offset === "undefined") {
      throw new Error("Offset undefined", {
        cause: { code: 400 }
      });
    }

    const files = await FileService.findLimitFilesByIdUser(
      validAuth.idUser,
      offset
    );

    res.status(200).json(files);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
