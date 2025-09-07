import { ResetPassword } from "../model/resetPasswordModel.js";
import { UserService } from "./userService.js";
import bcryp, { hash } from "bcrypt";

const resetPassword = new ResetPassword();
export const ResetPasswordService = {
  sendEmail: async (email, token) => {
    try {
      const userFound = await UserService.findUserByEmail(email);

      if (!userFound) {
        throw new Error("Email not recognized", { cause: { code: 404 } });
      }
      resetPassword.propUser = userFound;
      resetPassword.propToken = token;

      const emailSent = await resetPassword.sendEmailToReset();

      return emailSent;
    } catch (error) {
      throw error;
    }
  },
  updatePasswordByEmail: async (email, newPassword) => {
    try {
      const userFound = await UserService.findUserByEmail(email);

      if (!userFound) {
        throw new Error("Email not recognized", { cause: { code: 404 } });
      }

      const hash = await bcryp.hash(newPassword, 10);

      resetPassword.propUser = userFound;
      resetPassword.propNewPassword = hash;

      const userPasswordUpdated =
        await resetPassword.patchPasswordUserByEmail();

      return userPasswordUpdated;
    } catch (error) {
      throw error;
    }
  }
};
