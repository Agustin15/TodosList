import bcrypt from "bcrypt";
import { User } from "../model/userModel.js";
import { authRequest, authRequestResetPassword } from "../auth/auth.js";

const userModel = new User();

export const createUser = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    const userToAdd = req.body;
    const userFoundByEmail = await findUserByEmail(userToAdd.email);

    if (userFoundByEmail.length > 0) {
      throw new Error("Email is already taken");
    }

    const saltRounds = 10;
    bcrypt.hash(userToAdd.password, saltRounds, async (err, hash) => {
      if (err) {
        throw new Error({ messageError: "Internal server error" });
      }

      userToAdd.password = hash;
      const userCreated = await userModel.addUser(
        userToAdd.name,
        userToAdd.lastname,
        userToAdd.email,
        userToAdd.password
      );

      if (userCreated == 0) {
        throw new Error("Error to add user");
      }
      res.status(201).json(userCreated);
    });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    if (!req.params.email) {
      throw new Error("email undefined");
    }

    const email = req.params.email;
    const userFound = await userModel.getUserByEmail(email);
    res.status(200).json(userFound);
  } catch (error) {
    res.status(502).json({ messageError: error });
  }
};

export const findUserByEmail = async (email) => {
  try {
    const userFound = await userModel.getUserByEmail(email);
    return userFound;
  } catch (error) {
    throw error;
  }
};

export const findUserByIdUser = async (idUser) => {
  try {
    const userFound = await userModel.getUserById(idUser);
    return userFound;
  } catch (error) {
    throw error;
  }
};

export const getUserDataByToken = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);

    let userFound = await findUserByIdUser(validAuth.idUser);
    userFound = userFound[0];
    userFound.name = userFound.nameUser;
    delete userFound.nameUser;

    res.status(200).json(userFound);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updatePasswordUserById = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    const newPassword = req.body.password;

    const decodeTokenAuth = await authRequest(req, res);

    if (req.body.currentPassword) {
      const currentPassword = req.body.currentPassword;

      const userFound = await findUserByIdUser(decodeTokenAuth.idUser);
      if (!userFound.length > 0) {
        throw new Error("User not found");
      }

      const passwordVerify = await bcrypt.compare(
        currentPassword,
        userFound[0].passwordUser
      );

      if (!passwordVerify) {
        throw new Error("Invalid current password");
      }
    }

    bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (err) {
        throw new Error({ messageError: "Internal server error" });
      }

      const userUpdated = await userModel.updatePasswordUserById(
        hash,
        decodeTokenAuth.idUser
      );

      if (userUpdated == 0) {
        throw new Error("Error to update user");
      }
      res.status(200).json(userUpdated);
    });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updatePasswordByEmail = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    const newPassword = req.body.newPassword;

    const decodeToken = await authRequestResetPassword(req, res);

    bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (err) {
        throw new Error({ messageError: "Internal server error" });
      }

      const passwordUpdated = await userModel.updatePasswordUserByEmail(
        hash,
        decodeToken.mail
      );

      if (passwordUpdated == 0) {
        throw new Error("Error to update password user");
      }
      res.status(200).json(passwordUpdated);
    });
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    let userFound;

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }
    if (!req.params.id) {
      throw new Error("id undefined");
    }
    const idUser = req.params.id;
    const { name, lastname } = req.body;

    userFound = await findUserByIdUser(idUser);
    if (!userFound.length > 0) {
      throw new Error("User not found");
    }
    await authRequest(req, res);

    const userUpdated = await userModel.updateUser(
      name,
      lastname,
      userFound[0].email,
      userFound[0].passwordUser,
      userFound[0].idUser
    );

    if (userUpdated == 0) {
      throw new Error("User not updated");
    }

    userFound = await findUserByIdUser(idUser);
    userFound = userFound[0];
    userFound.name = userFound.nameUser;
    delete userFound.nameUser;

    res.status(200).json(userFound);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateEmailUser = async (req, res) => {
  let userFound;
  try {
    if (!req.body.newEmail) {
      throw new Error("new email undefined");
    }
    if (!req.body.password) {
      throw new Error("password undefined");
    }

    const newEmail = req.body.newEmail;
    const password = req.body.password;

    const validAuth = await authRequest(req, res);

    const userEmailUsed = await findUserByEmail(newEmail);

    if (userEmailUsed.length > 0) {
      throw new Error("Failed to update, email in use");
    }

    userFound = await findUserByIdUser(validAuth.idUser);

    if (!userFound.length > 0) {
      throw new Error("User not found");
    }
    const passwordVerify = await bcrypt.compare(
      password,
      userFound[0].passwordUser
    );

    if (!passwordVerify) {
      throw new Error("Failed to update, invalid password");
    }
    let resultUpdated = await userModel.updateEmailUserById(
      newEmail,
      validAuth.idUser
    );

    if (resultUpdated == 0) throw new Error("Failed to update email user");

    userFound = await findUserByIdUser(validAuth.idUser);

    if (!userFound.length > 0) {
      throw new Error("User not found");
    }
    res.status(200).json(userFound[0]);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
