import express from "express";
import {
  getUserByEmail,
  getUserDataByToken,
  updateUserById
} from "../controllers/userController.js";

export const userDataRoutes = express.Router();

userDataRoutes.put("/:id", updateUserById);
userDataRoutes.get("/", getUserDataByToken);
userDataRoutes.get("/:email", getUserByEmail);
