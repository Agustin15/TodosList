import { ResetPassword } from "../model/resetPasswordModel.js";
import { UserService } from "./userService.js";

const resetPassword = new ResetPassword();
export const ResetPasswordService = {
  sendEmail: async (email, token) => {
    try {
      const userFound = await UserService.findUserByEmail(email);

      if (!userFound) {
        throw new Error("Email not recognized");
      }
      resetPassword.propUser = userFound;
      resetPassword.propToken = token;

      const emailSent = resetPassword.sendEmailToReset();

      return emailSent;
    } catch (error) {
      throw error;
    }
  },
  updatePasswordByEmail: async (email, newPassword) => {
    try {
      const userFound = await UserService.findUserByEmail(email);

      if (!userFound) {
        throw new Error("Email not recognized");
      }
      resetPassword.propUser = userFound;
      resetPassword.propNewPassword = newPassword;

      const userPasswordUpdated = resetPassword.patchPasswordUserByEmail();

      return userPasswordUpdated;
    } catch (error) {
      throw error;
    }
  }
};
