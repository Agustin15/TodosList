import { VerificationTwoStep } from "../model/verificationTwoStepModel.js";
import { UserService } from "../services/userService.js";
import bcrypt from "bcrypt";

const verificationTwoStepModel = new VerificationTwoStep();

export const VerificationTwoStepService = {
  addVerificationTwoStep: async (idUser, idRol, confirmPassword) => {
    try {
      verificationTwoStepModel.propIdUser = idUser;
      verificationTwoStepModel.propIdRol = idRol;
      verificationTwoStepModel.propEnabled = 1;

      const userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound)
        throw new Error("User not found", { cause: { code: 404 } });

      let match = await bcrypt.compare(confirmPassword, userFound.passwordUser);

      if (!match)
        throw new Error("Password entered is incorrect", {
          cause: { code: 401 }
        });

      const verificationTwoStepAdded = await verificationTwoStepModel.post();

      return verificationTwoStepAdded;
    } catch (error) {
      throw error;
    }
  },

  changeStateVerificationTwoStep: async (
    idUser,
    idRol,
    newState,
    confirmPassword
  ) => {
    try {
      verificationTwoStepModel.propIdUser = idUser;
      verificationTwoStepModel.propIdRol = idRol;
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

  findVerificationByUserAndRol: async (idUser, idRol) => {
    try {
      verificationTwoStepModel.propIdUser = idUser;
      verificationTwoStepModel.propIdRol = idRol;

      let verificationTwoStepFound =
        await verificationTwoStepModel.getVerificationByUserAndRol();

      if (verificationTwoStepFound.length > 0)
        return verificationTwoStepFound[0];
      else return null;
    } catch (error) {
      throw error;
    }
  }
};
