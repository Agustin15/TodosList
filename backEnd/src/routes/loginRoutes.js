import express from "express";
import { login } from "../controllers/loginController.js";

export const loginRoutes = express.Router();

loginRoutes.post("/", login);
