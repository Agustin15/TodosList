import express from "express";
import {
  getUserByEmail,
  getUserDataByToken,
  updateUserById,
  updateEmailUser,
  updatePasswordUserById
} from "../controllers/userController.js";

export const userDataRoutes = express.Router();

userDataRoutes.patch("/:optionPatch", function (req, res) {
  let optionPatch = JSON.parse(req.params.optionPatch);

  switch (optionPatch.option) {
    case "updateEmailUser":
      return updateEmailUser(req, res);
    case "updatePasswordUserById":
      return updatePasswordUserById(req, res);
  }
});
userDataRoutes.put("/:id", updateUserById);
userDataRoutes.get("/", getUserDataByToken);
userDataRoutes.get("/:email", getUserByEmail);
