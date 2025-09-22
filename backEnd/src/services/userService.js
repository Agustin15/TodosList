import { User } from "../model/userModel.js";
import { UsersRolsService } from "./usersRolsService.js";
import bcrypt from "bcrypt";
import { connectionMysql } from "../config/database.js";

const userModel = new User();

export const UserService = {
  createUser: async (userToAdd) => {
    let connection;
    try {
      userModel.propName = userToAdd.name;
      userModel.propLastname = userToAdd.lastname;

      const userFoundByEmail = await UserService.findUserByEmail(
        userToAdd.email
      );

      if (userFoundByEmail) {
        throw new Error("Email is already taken", { cause: { code: 409 } });
      }

      const hash = await bcrypt.hash(userToAdd.password, 10);

      userModel.propPassword = hash;

      connection = await connectionMysql.pool.getConnection();

      await connection.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      await connection.beginTransaction();

      const userCreated = await userModel.post(connection);

      if (userCreated == 0) {
        throw new Error("Error to add user", { cause: { code: 500 } });
      }

      const userAdded = await UserService.findUserByEmail(
        userToAdd.email,
        connection
      );

      if (!userAdded) {
        throw new Error("User recently added not found", {
          cause: { code: 404 }
        });
      }

      await UsersRolsService.addUserRol(userAdded.idUser, connection);
      await connection.commit();

      connection.release();

      return userCreated;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) connection.release();
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

  findUserByEmail: async (email, connection) => {
    try {
      userModel.propEmailAddress = email;

      const userFound = await userModel.getUserByEmail(connection);
      return userFound[0];
    } catch (error) {
      throw error;
    }
  },

  findUserByIdUser: async (idUser, connection) => {
    try {
      userModel.propIdUser = parseInt(idUser);
      const userFound = await userModel.getUserById(connection);
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
        throw new Error("User not found", { cause: { code: 404 } });
      }

      const passwordVerify = await bcrypt.compare(
        currentPassword,
        userFound.passwordUser
      );

      if (!passwordVerify) {
        throw new Error("Invalid current password", { cause: { code: 401 } });
      }

      const hash = await bcrypt.hash(newPassword, 10);

      userModel.propPassword = hash;
      userModel.propIdUser = idUser;
      let userUpdated = await userModel.patchPasswordUserById();

      if (userUpdated == 0) {
        throw new Error("Error to update user", { cause: { code: 500 } });
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
        throw new Error("Error to update password user", {
          cause: { code: 500 }
        });
      }
      return passwordUpdated;
    } catch (error) {
      throw error;
    }
  },

  updateUserById: async (name, lastname, idUser) => {
    let connection;
    try {
      let userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) {
        throw new Error("User not found", { cause: { code: 404 } });
      }

      userModel.propName = name;
      userModel.propLastname = lastname;
      userModel.propIdUser = parseInt(idUser);
      userModel.propPassword = userFound.passwordUser;
      userModel.propEmailAddress = userFound.email;

      connection = await connectionMysql.pool.getConnection();

      await connection.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      await connection.beginTransaction();

      const userUpdated = await userModel.put(connection);
      if (userUpdated == 0) {
        throw new Error("User not updated", { cause: { code: 500 } });
      }

      userFound = await UserService.findUserByIdUser(idUser, connection);
      userFound.name = userFound.nameUser;
      delete userFound.nameUser;

      connection.commit();
      connection.release();

      return userFound;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  updateEmailUser: async (newEmail, password, idUser) => {
    let userFound, connection;
    try {
      const userEmailUsed = await UserService.findUserByEmail(newEmail);

      if (userEmailUsed) {
        throw new Error("Failed to update, email in use", {
          cause: { code: 409 }
        });
      }

      userFound = await UserService.findUserByIdUser(idUser);

      if (!userFound) {
        throw new Error("User not found", { cause: { code: 404 } });
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

      const connection = await connectionMysql.pool.getConnection();

      await connection.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      await connection.beginTransaction();

      let resultUpdated = await userModel.patchEmailUserById(connection);

      if (resultUpdated == 0)
        throw new Error("Failed to update email user", {
          cause: { code: 500 }
        });

      userFound = await UserService.findUserByIdUser(idUser, connection);
      userFound.name = userFound.nameUser;
      delete userFound.nameUser;

      if (!userFound) {
        throw new Error("User not found", { cause: { code: 404 } });
      }

      await connection.commit();
      connection.release();

      return userFound;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
};
