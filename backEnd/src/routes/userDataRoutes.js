import express from "express";
import {getUserByEmail,getUserDataByToken } from "../controllers/userController.js";

export const userDataRoutes = express.Router();

// userDataRoutes.put("/:email", updateEmailUser);
userDataRoutes.get("/", getUserDataByToken);
userDataRoutes.get("/:email", getUserByEmail);
