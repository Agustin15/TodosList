import express from "express";
import {
  sendVerificationCode,
  comprobateVerificationCode
} from "../controllers/verificationCodeController.js";
export const verificationCodeRoutes = express.Router();

verificationCodeRoutes.post("/:option", (req, res) => {
  if (!req.params) {
    throw new Error("Params request null");
  }

  if (!req.params.option) throw new Error("option undefined");

  let optionPost = JSON.parse(req.params.option);

  switch (optionPost.option) {
    case "sendVerificationCode":
      return sendVerificationCode(req, res);
    case "comprobateVerificationCode":
      return comprobateVerificationCode(req, res);
  }
});
