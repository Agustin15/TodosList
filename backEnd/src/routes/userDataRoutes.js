import express from "express";
import { updateEmailUser,getUserByEmail } from "../controllers/userController.js";

export const userDataRoutes = express.Router();

userDataRoutes.put("/:email", updateEmailUser);
userDataRoutes.get("/:email", getUserByEmail);
