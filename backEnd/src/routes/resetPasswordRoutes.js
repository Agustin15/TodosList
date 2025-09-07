import express from "express";
import { authRequestByHeader } from "../auth/auth.js";
import {
  updatePasswordByEmail,
  sendEmailToReset
} from "../controllers/resetPasswordController.js";

export const resetPasswordRoutes = express.Router();

resetPasswordRoutes.get("/", async function (req, res) {
  try {
    const decodeToken = await authRequestByHeader(req, res);
    res.status(200).json(decodeToken);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 401)
      .json({ messageError: error.message });
  }
});

resetPasswordRoutes.patch("/", updatePasswordByEmail);

resetPasswordRoutes.post("/", sendEmailToReset);
