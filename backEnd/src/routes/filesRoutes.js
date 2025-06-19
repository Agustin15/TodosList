import express from "express";
import {
  findLimitFilesByIdUser,
  findQuantityFilesByIdUser
} from "../controllers/fileController.js";
export const filesRoutes = express.Router();

filesRoutes.get("/:getFilesParams", (req, res) => {
  const { option } = JSON.parse(req.params.getFilesParams);

  if (!option) res.status(404).json({ messageError: "undefined option" });

  switch (option) {
    case "getQuantityFilesByUser":
      return findQuantityFilesByIdUser(req, res);

    case "getFilesLimitByUser":
      return findLimitFilesByIdUser(req, res);
      break;
  }
});
