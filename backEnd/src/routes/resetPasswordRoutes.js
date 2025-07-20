import express from "express";
import { authRequestResetPassword } from "../auth/auth.js";
import { updatePasswordByEmail,sendEmailToReset } from "../controllers/resetPasswordController.js";

export const resetPasswordRoutes = express.Router();

resetPasswordRoutes.get("/", async function (req, res) {
  const decodeToken = await authRequestResetPassword(req, res);
  res.status(200).json(decodeToken);
});

resetPasswordRoutes.patch("/", updatePasswordByEmail);

resetPasswordRoutes.post("/", sendEmailToReset);
