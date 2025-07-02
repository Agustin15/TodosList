import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";

const userModel = new User();

export const UserService = {
  createUser: async (userToAdd) => {
    try {
      const userFoundByEmail = await UserService.findUserByEmail(
        userToAdd.email
      );

      if (userFoundByEmail) {
        throw new Error("Email is already taken");
      }

      const hash = await bcrypt.hash(userToAdd.password, 10);

      const userCreated = await userModel.post(
        userToAdd.name,
        userToAdd.lastname,
        userToAdd.email,
        hash
      );

      if (userCreated == 0) {
        throw new Error("Error to add user");
      }
      return userCreated;
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const userFound = await userModel.getUserByEmail(email);
      return userFound;
    } catch (error) {
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      const userFound = await userModel.getUserByEmail(email);
      return userFound[0];
    } catch (error) {
      throw error;
    }
  },

  findUserByIdUser: async (idUser) => {
    try {
      const userFound = await userModel.getUserById(idUser);
      return userFound[0];
    } catch (error) {
      throw error;
    }
  },

  getUserDataByToken: async (idUser) => {
    try {
      let userFound = await UserService.findUserByIdUser(idUser);
      userFound.name = userFound.nameUser;
      delete userFound.nameUser;

      return userFound;
    } catch (error) {
      throw error;
    }
  },

  updatePasswordUserById: async (idUser, newPassword, currentPassword) => {
    try {
      const userFound = await UserService.findUserByIdUser(idUser);
      if (!userFound) {
        throw new Error("User not found");
      }

      const passwordVerify = await bcrypt.compare(
        currentPassword,
        userFound.passwordUser
      );

      if (!passwordVerify) {
        throw new Error("Invalid current password");
      }

      const hash = await bcrypt.hash(newPassword, 10);

      let userUpdated = await userModel.patchPasswordUserById(hash, idUser);

      if (userUpdated == 0) {
        throw new Error("Error to update user");
      }

      return userUpdated;
    } catch (error) {
      throw error;
    }
  },

  updatePasswordByEmail: async (email, newPassword) => {
    try {
      const hash = await bcrypt.hash(newPassword, 10);

      const passwordUpdated = await userModel.patchPasswordUserByEmail(
        hash,
        email
      );
      if (passwordUpdated == 0) {
        throw new Error("Error to update password user");
      }
      return passwordUpdated;
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (name, lastname, idUser) => {
    try {
      let userFound;

      userFound = await UserService.findUserByIdUser(idUser);
      if (!userFound) {
        throw new Error("User not found");
      }

      const userUpdated = await userModel.put(
        name,
        lastname,
        userFound.email,
        userFound.passwordUser,
        userFound.idUser
      );

      if (userUpdated == 0) {
        throw new Error("User not updated");
      }

      userFound = await UserService.findUserByIdUser(idUser);
      userFound.name = userFound.nameUser;
      delete userFound.nameUser;

      return userFound;
    } catch (error) {
      throw error;
    }
  },

  updateEmailUser: async (newEmail, password, idUser) => {
    let userFound;
    try {
      const userEmailUsed = await UserService.findUserByEmail(newEmail);

      if (!userEmailUsed) {
        throw new Error("Failed to update, email in use");
      }

      userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) {
        throw new Error("User not found");
      }

      const passwordVerify = await bcrypt.compare(
        password,
        userFound.passwordUser
      );

      if (!passwordVerify) {
        throw new Error("Failed to update, invalid password");
      }
      let resultUpdated = await userModel.patchEmailUserById(newEmail, idUser);

      if (resultUpdated == 0) throw new Error("Failed to update email user");

      userFound = await UserService.findUserByIdUser(idUser);
      userFound.name = userFound.nameUser;
      delete userFound.nameUser;

      if (!userFound) {
        throw new Error("User not found");
      }
      return userFound;
    } catch (error) {
      throw error;
    }
  },
  verifyValidString: (value) => {
    let valid = true;
    for (let f = 0; f < value.length; f++) {
      if (!value[f].match(/[a-z]/i) || [f] == "") {
        return false;
      }
    }

    return valid;
  }
};
