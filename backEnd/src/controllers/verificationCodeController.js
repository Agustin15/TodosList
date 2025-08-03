import { VerificationCodeService } from "../services/verificationCodeService.js";
import jwt from "jsonwebtoken";

export const sendVerificationCode = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.idUser) {
      throw new Error("idUser undefined");
    }

    let idUser = req.body.idUser;

    const verificationSent = await VerificationCodeService.sendVerificationCode(
      idUser
    );

    res.status(200).json(verificationSent);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const comprobateVerificationCode = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.idUser) {
      throw new Error("idUser undefined");
    }
    if (!req.body.codeEntered) {
      throw new Error("codeEntered undefined");
    }

    if (!process.env.JWT_SECRET_KEY)
      throw new Error("JWT secret key not declared");
    if (!process.env.JWT_SECRET_KEY_REFRESH)
      throw new Error("JWT secret refresh key not declared");

    const secretKey = process.env.JWT_SECRET_KEY;
    const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;
    
    const { idUser, codeEntered } = req.body;

    const verificationCodeValid =
      await VerificationCodeService.comprobateVerificationCode(
        codeEntered,
        idUser
      );

    if (verificationCodeValid) {
      const token = jwt.sign({ idUser: idUser }, secretKey, {
        algorithm: "HS256",
        expiresIn: "1h"
      });

      const refreshToken = jwt.sign({ idUser: idUser }, secretKeyRefresh, {
        algorithm: "HS256",
        expiresIn: "24h"
      });

      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });
    }

    res.status(200).json(verificationCodeValid);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
