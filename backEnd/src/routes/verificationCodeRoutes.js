import express from "express";
import { sendVerificationCode } from "../controllers/verificationCodeController.js";
export const verificationCodeRoutes = express.Router();

verificationCodeRoutes.post("/", sendVerificationCode);
