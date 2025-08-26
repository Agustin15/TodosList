import jwt from "jsonwebtoken";
import { ResetPasswordService } from "../services/resetPasswordService.js";
import { authRequestByHeader } from "../auth/auth.js";

export const sendEmailToReset = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null", {
        cause: { code: 400 }
      });
    }

    if (!req.body.mail)
      throw new Error("Email undefined", {
        cause: { code: 400 }
      });

    if (!process.env.JWT_SECRET_KEY)
      throw new Error("JWT secret key not declared");

    const mail = req.body.mail;
    const secretKey = process.env.JWT_SECRET_KEY;

    const tokenResetPassword = jwt.sign({ mail: mail }, secretKey, {
      algorithm: "HS256",
      expiresIn: "15m"
    });

    const emailSent = await ResetPasswordService.sendEmail(
      mail,
      tokenResetPassword
    );

    res.status(200).json(emailSent);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const updatePasswordByEmail = async (req, res) => {
  try {
    const decodeToken = await authRequestByHeader(req, res);

    if (!req.body || Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    if (!req.body.newPassword)
      throw new Error("New password undefined", {
        cause: { code: 400 }
      });
      
    const newPassword = req.body.newPassword;

    const passwordUpdated = await ResetPasswordService.updatePasswordByEmail(
      decodeToken.mail,
      newPassword
    );

    res.status(200).json(passwordUpdated);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};
