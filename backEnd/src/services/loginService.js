import { UserService } from "./userService.js";
import { VerificationTwoStepService } from "./verificationTwoStepService.js";
import { VerificationCodeService } from "./verificationCodeService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const LoginService = {
  login: async (email, password) => {
    try {
      if (!process.env.JWT_SECRET_KEY)
        throw new Error("JWT secret key not declared", {
          cause: { code: 500 }
        });
      if (!process.env.JWT_SECRET_KEY_REFRESH)
        throw new Error("JWT secret refresh key not declared", {
          cause: { code: 500 }
        });

      const secretKey = process.env.JWT_SECRET_KEY;
      const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;

      let userFound = await UserService.findUserByEmail(email);

      if (!userFound) {
        throw new Error("Authentication failed,invalid user entered", {
          cause: { code: 404 }
        });
      }

      let verifyPassword = await bcrypt.compare(
        password,
        userFound.passwordUser
      );
      if (!verifyPassword)
        throw new Error("Authentication failed,invalid password entered", {
          cause: { code: 401 }
        });

      const verificationTwoStepFound =
        await VerificationTwoStepService.findVerificationByUser(
          userFound.idUser
        );

      if (!verificationTwoStepFound || verificationTwoStepFound.enabled == 0) {
        const token = jwt.sign({ idUser: userFound.idUser }, secretKey, {
          algorithm: "HS256",
          expiresIn: "1h"
        });

        const refreshToken = jwt.sign(
          { idUser: userFound.idUser },
          secretKeyRefresh,
          {
            algorithm: "HS256",
            expiresIn: "24h"
          }
        );

        return { login: true, token: token, refreshToken: refreshToken };
      } else {
        const verificationCodeSent =
          await VerificationCodeService.sendVerificationCode(userFound.idUser);

        if (!verificationCodeSent)
          throw new Error("Failed to send verification code", {
            cause: { code: 500 }
          });

        const tokenVerification = jwt.sign(
          { email: userFound.email, idUser: userFound.idUser },
          secretKey,
          {
            algorithm: "HS256",
            expiresIn: "5m"
          }
        );

        return { login: true, tokenVerification: tokenVerification };
      }
    } catch (error) {
      throw error;
    }
  }
};
