import express from "express";
import { verifyUserLogin } from "../controllers/userController.js";

export const loginRoutes= express.Router();

loginRoutes.post("/",verifyUserLogin);
