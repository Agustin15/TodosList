import { connectionMysql } from "../config/database.js";
import { VerificationCode } from "../model/verificationCodeModel.js";
import { VerificationTwoStepService } from "../services/verificationTwoStepService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "./userService.js";
const verificationCodeModel = new VerificationCode();

export const VerificationCodeService = {
  sendVerificationCode: async (idUser, idRol, option) => {
    let connection;
    try {
      let result;

      const verificationFound =
        await VerificationTwoStepService.findVerificationByUserAndRol(
          idUser,
          idRol
        );

      if (!verificationFound)
        throw new Error("Verification two step not found", {
          cause: { code: 404 }
        });

      connection = await connectionMysql.pool.getConnection();

      await connection.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      await connection.beginTransaction();

      await verificationCodeModel.generateCode(connection);

      verificationCodeModel.generateExpirationTime();
      verificationCodeModel.propIdVerification =
        verificationFound.idVerification;

      const codeHash = await bcrypt.hash(
        verificationCodeModel.propCode.toString(),
        10
      );

      verificationCodeModel.propCodeHash = codeHash;

      const verificationCodeAdded = await verificationCodeModel.post(
        connection
      );

      if (!verificationCodeAdded)
        throw new Error("Failed to add verification code", {
          cause: { code: 500 }
        });

      const userFound = await UserService.findUserByIdUser(idUser, connection);

      if (!userFound)
        throw new Error("User not found", { cause: { code: 404 } });

      result = await verificationCodeModel.sendCodeByEmail(userFound.email);

      if (!result)
        throw new Error("Failed to send verification email", {
          cause: { code: 500 }
        });

      if (option == "sendAgain") {
        if (!process.env.JWT_SECRET_KEY)
          throw new Error("JWT secret key not declared", {
            cause: { code: 500 }
          });
        const secretKey = process.env.JWT_SECRET_KEY;

        const newVerificationToken = jwt.sign(
          { email: userFound.email, idUser: idUser, idRol: idRol },
          secretKey,
          {
            algorithm: "HS256",
            expiresIn: "5m"
          }
        );

        result = newVerificationToken;
      }

      await connection.commit();
      connection.release();

      return result;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  comprobateVerificationCode: async (codeEntered, idUser, idRol) => {
    try {
      const verificationTwoStepFound =
        await VerificationTwoStepService.findVerificationByUserAndRol(
          idUser,
          idRol
        );

      if (!verificationTwoStepFound)
        throw new Error("Verification two step not found", {
          cause: { code: 404 }
        });

      verificationCodeModel.propIdVerification =
        verificationTwoStepFound.idVerification;

      const verificationsCodeFound =
        await verificationCodeModel.getVerificationsCodeByIdVerification();

      if (verificationsCodeFound.length == 0)
        throw new Error("Verifications code not found", {
          cause: { code: 404 }
        });

      let notMatch = 0;
      for (const verificationCodeFound of verificationsCodeFound) {
        let match = await bcrypt.compare(
          codeEntered,
          verificationCodeFound.codeOfVerification
        );

        if (match && verificationCodeFound.expirationTime > Date.now()) {
          return true;
        } else notMatch++;
      }

      if (notMatch == verificationsCodeFound.length)
        throw new Error("Verification code entered not recognized", {
          cause: { code: 401 }
        });
    } catch (error) {
      throw error;
    }
  }
};
