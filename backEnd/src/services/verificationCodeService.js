import connection from "../config/database.js";
import { VerificationCode } from "../model/verificationCodeModel.js";
import { VerificationTwoStepService } from "../services/verificationTwoStepService.js";
import bcrypt from "bcrypt";
import { UserService } from "./userService.js";
const verificationCodeModel = new VerificationCode();

export const VerificationCodeService = {
  sendVerificationCode: async (idUser) => {
    try {
      await connection.beginTransaction();
      const verificationFound =
        await VerificationTwoStepService.findVerificationByUser(idUser);

      if (!verificationFound)
        throw new Error("Verification two step not found");

      await verificationCodeModel.generateCode();
      verificationCodeModel.generateExpirationTime();
      verificationCodeModel.propIdVerification =
        verificationFound.idVerification;

      const codeHash = await bcrypt.hash(
        verificationCodeModel.propCode.toString(),
        10
      );

      verificationCodeModel.propCodeHash = codeHash;

      const verificationCodeAdded = await verificationCodeModel.post();

      if (!verificationCodeAdded)
        throw new Error("Failed to add verification code");

      const userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) throw new Error("User not found");

      const verificationSent = await verificationCodeModel.sendCodeByEmail(
        userFound.email
      );

      if (!verificationSent)
        throw new Error("Failed to send verification email");

      await connection.commit();
      return verificationSent;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  },

  comprobateVerificationCode: async (codeEntered, idUser) => {
    try {
      const verificationTwoStepFound =
        await VerificationTwoStepService.findVerificationByUser(idUser);

      if (!verificationTwoStepFound)
        throw new Error("Verification two step not found");

      verificationCodeModel.propIdVerification =
        verificationTwoStepFound.idVerification;

      const verificationsCodeFound =
        await verificationCodeModel.getVerificationsCodeByIdVerification();

      if (verificationsCodeFound.length == 0)
        throw new Error("Verifications code not found");

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
        throw new Error("Verification code entered not recognized");
    } catch (error) {
      throw error;
    }
  }
};
