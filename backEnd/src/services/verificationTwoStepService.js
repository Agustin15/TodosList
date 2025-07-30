import { VerificationTwoStep } from "../model/VerificationTwoStepModel.js";
import { UserService } from "../services/userService.js";
import bcrypt from "bcrypt";

const verificationTwoStepModel = new VerificationTwoStep();

export const VerificationTwoStepService = {
  addVerificationTwoStep: async (idUser, confirmPassword) => {
    try {
      verificationTwoStepModel.propIdUser = idUser;
      verificationTwoStepModel.propEnabled = 1;

      const userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) throw new Error("User not found");

      let match = await bcrypt.compare(confirmPassword, userFound.passwordUser);

      if (!match) throw new Error("Password entered is incorrect");

      const verificationTwoStepAdded = await verificationTwoStepModel.post();

      return verificationTwoStepAdded;
    } catch (error) {
      throw error;
    }
  },

  changeStateVerificationTwoStep: async (idUser, newState, confirmPassword) => {
    try {
 
      verificationTwoStepModel.propIdUser = idUser;
      verificationTwoStepModel.propEnabled = newState;

      const userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) throw new Error("User not found");

      let match = await bcrypt.compare(confirmPassword, userFound.passwordUser);

      if (!match) throw new Error("Password entered is incorrect");

      const verificationTwoStepUpdated = await verificationTwoStepModel.patch();

      return verificationTwoStepUpdated;
    } catch (error) {
      throw error;
    }
  },

  findVerificationByUser: async (idUser) => {
    try {
      verificationTwoStepModel.propIdUser = idUser;

      let verificationTwoStepFound =
        await verificationTwoStepModel.getVerificationByUser();

      if (verificationTwoStepFound.length > 0)
        return verificationTwoStepFound[0];
      else return null;
    } catch (error) {
      throw error;
    }
  }
};
