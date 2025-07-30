import { VerificationCode } from "../model/verificationCodeModel.js";
import { VerificationTwoStepService } from "../services/verificationTwoStepService.js";
import bcrypt from "bcrypt";
import { UserService } from "./userService.js";
const verificationCodeModel = new VerificationCode();

export const VerificationCodeService = {
  
  sendVerificationCode: async (idUser) => {
    try {
      const verificationFound =
        await VerificationTwoStepService.findVerificationByUser(idUser);

      if (!verificationFound)
        throw new Error("Verification two step not found");

      await verificationCodeModel.generateCode();
      verificationCodeModel.generateExpirationTime();
      verificationCodeModel.propIdVerification =
        verificationFound.idVerification;

      const codeHash = await bcrypt.hash(verificationCodeModel.propCode, 10);

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

      return verificationSent;
    } catch (error) {
      throw error;
    }
  }
};
