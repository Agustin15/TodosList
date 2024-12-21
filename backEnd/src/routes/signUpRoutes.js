import express from "express";
import { createUser } from "../controllers/userController.js";

export const signUpRouter = express.Router();

signUpRouter.post("/", createUser);
