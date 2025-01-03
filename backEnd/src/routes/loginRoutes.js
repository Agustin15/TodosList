import express from "express";
import { verifyUserLogin ,getUsername} from "../controllers/userController.js";

export const loginRoutes= express.Router();

loginRoutes.post("/",verifyUserLogin);
loginRoutes.get("/:username",getUsername);
