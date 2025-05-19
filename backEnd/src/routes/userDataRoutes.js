import express from "express";
import {
  getUserByEmail,
  getUserDataByToken,
  updateUserById,
  updateEmailUser
} from "../controllers/userController.js";

export const userDataRoutes = express.Router();

userDataRoutes.patch("/", updateEmailUser);
userDataRoutes.put("/:id", updateUserById);
userDataRoutes.get("/", getUserDataByToken);
userDataRoutes.get("/:email", getUserByEmail);
