import { User } from "../model/userModel.js";
import bcrypt, { hash } from "bcrypt";

const userModel = new User();

export const UserService = {
  createUser: async (userToAdd) => {
    try {
      userModel.propName = userToAdd.name;
      userModel.propLastname = userToAdd.lastname;
      const userFoundByEmail = await UserService.findUserByEmail(
        userToAdd.email
      );

      if (userFoundByEmail) {
        throw new Error("Email is already taken");
      }

      const hash = await bcrypt.hash(userToAdd.password, 10);

      userModel.propPassword = hash;
      const userCreated = await userModel.post();

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
      userModel.propEmailAddress = email;

      const userFound = await userModel.getUserByEmail();
      return userFound;
    } catch (error) {
      throw error;
    }
  },

  findUserByEmail: async (email) => {
    try {
      userModel.propEmailAddress = email;

      const userFound = await userModel.getUserByEmail();
      return userFound[0];
    } catch (error) {
      throw error;
    }
  },

  findUserByIdUser: async (idUser) => {
    try {
      userModel.propIdUser = parseInt(idUser);
      const userFound = await userModel.getUserById();
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

      userModel.propPassword = hash;
      userModel.propIdUser = idUser;
      let userUpdated = await userModel.patchPasswordUserById();

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

      userModel.propEmailAddress = email;
      userModel.propPassword = hash;

      const passwordUpdated = await userModel.patchPasswordUserByEmail();
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
      let userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) {
        throw new Error("User not found");
      }

      userModel.propName = name;
      userModel.propLastname = lastname;
      userModel.propIdUser = parseInt(idUser);
      userModel.propPassword = userFound.passwordUser;
      userModel.propEmailAddress = userFound.email;

      const userUpdated = await userModel.put();
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

      userModel.propEmailAddress = newEmail;
      userModel.propIdUser = idUser;

      let resultUpdated = await userModel.patchEmailUserById();

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
  }
};
