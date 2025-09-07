import { VerificationCodeService } from "../services/verificationCodeService.js";
import { authRequestByHeader } from "../auth/auth.js";
import jwt from "jsonwebtoken";

export const sendVerificationCode = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null", {
        cause: { code: 400 }
      });
    }

    if (!req.body.idUser) {
      throw new Error("idUser undefined", {
        cause: { code: 400 }
      });
    }

    if (!req.body.idRol) {
      throw new Error("idRol undefined", {
        cause: { code: 400 }
      });
    }

    if (!req.body.option) {
      throw new Error("option undefined", {
        cause: { code: 400 }
      });
    }

    let { idUser, idRol, option } = req.body;

    const newVerificationToken =
      await VerificationCodeService.sendVerificationCode(idUser, idRol, option);

    res.status(200).json(newVerificationToken);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const dataToken = async (req, res) => {
  try {
    const decodeToken = await authRequestByHeader(req, res);
    res.status(200).json(decodeToken);
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};
export const comprobateVerificationCode = async (req, res) => {
  try {
    const decodeToken = await authRequestByHeader(req, res);

    if (!process.env.JWT_SECRET_KEY)
      throw new Error("JWT secret key not declared", {
        cause: { code: 500 }
      });
    if (!process.env.JWT_SECRET_KEY_REFRESH)
      throw new Error("JWT secret refresh key not declared", {
        cause: { code: 500 }
      });

    const secretKey = process.env.JWT_SECRET_KEY;
    const secretKeyRefresh = process.env.JWT_SECRET_KEY;

    if (!req.body) {
      throw new Error("Body request null", {
        cause: { code: 400 }
      });
    }

    if (!req.body.codeEntered) {
      throw new Error("codeEntered undefined", {
        cause: { code: 400 }
      });
    }

    const { codeEntered } = req.body;

    const verificationCodeValid =
      await VerificationCodeService.comprobateVerificationCode(
        codeEntered,
        decodeToken.idUser,
        decodeToken.idRol
      );

    if (verificationCodeValid) {
      const token = jwt.sign(
        { idUser: decodeToken.idUser, idRol: decodeToken.idRol },
        secretKey,
        {
          algorithm: "HS256",
          expiresIn: "1h"
        }
      );

      const refreshToken = jwt.sign(
        { idUser: decodeToken.idUser, idRol: decodeToken.idRol },
        secretKeyRefresh,
        {
          algorithm: "HS256",
          expiresIn: "24h"
        }
      );

      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "lax"
      });
    }

    res.status(200).json(verificationCodeValid);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 401)
      .json({ messageError: error.message });
  }
};
