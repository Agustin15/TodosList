import { UserService } from "./userService.js";
import { VerificationTwoStepService } from "./verificationTwoStepService.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

export const LoginService = {
  login: async (email, password) => {
    if (!process.env.JWT_SECRET_KEY)
      throw new Error("JWT secret key not declared");
    if (!process.env.JWT_SECRET_KEY_REFRESH)
      throw new Error("JWT secret refresh key not declared");

    const secretKey = process.env.JWT_SECRET_KEY;
    const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;

    let userFound = await UserService.findUserByEmail(email);

    if (!userFound) {
      throw new Error("Authentication failed,invalid user entered");
    }

    let verifyPassword = await bcrypt.compare(password, userFound.passwordUser);
    if (!verifyPassword) {
      throw new Error("Authentication failed,invalid password entered");
    } else {
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
      } else return { login: true, idUser: userFound.idUser };
    }
  }
};
