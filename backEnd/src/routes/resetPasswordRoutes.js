import express from "express";
import { authRequestByHeader } from "../auth/auth.js";
import { updatePasswordByEmail,sendEmailToReset } from "../controllers/resetPasswordController.js";

export const resetPasswordRoutes = express.Router();

resetPasswordRoutes.get("/", async function (req, res) {
  const decodeToken = await authRequestByHeader(req, res);
  res.status(200).json(decodeToken);
});

resetPasswordRoutes.patch("/", updatePasswordByEmail);

resetPasswordRoutes.post("/", sendEmailToReset);
