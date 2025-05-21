import bcrypt from "bcrypt";
import { UserModel } from "../model/userModel.js";
import { authRequest, authRequestResetPassword } from "../auth/auth.js";

export const createUser = async (req, res) => {
  try {
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
      const userCreated = await UserModel.addUser(
        userToAdd.name,
        userToAdd.lastname,
        userToAdd.email,
        userToAdd.password
      );
      res.status(201).json(userCreated);
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const userFound = await UserModel.getUserByEmail(email);
    res.status(200).json(userFound);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const findUserByEmail = async (email) => {
  try {
    const userFound = await UserModel.getUserByEmail(email);
    return userFound;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByIdUser = async (idUser) => {
  try {
    const userFound = await UserModel.getUserById(idUser);
    return userFound;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserDataByToken = async (req, res) => {
  let errorCodeResponse = 404;
  try {
    const validAuth = await authRequest(req, res);
    if (!validAuth) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authentication");
    }

    let userFound = await findUserByIdUser(validAuth.idUser);
    res.status(200).json(userFound[0]);
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updatePasswordUserById = async (req, res) => {
  try {
    const newPassword = req.body.password;

    const decodeTokenAuth = await authRequest(req, res);

    if (!decodeTokenAuth) {
      throw new Error("Invalid Authenticacion");
    }

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

      const userUpdated = await UserModel.updatePasswordUserById(
        hash,
        decodeTokenAuth.idUser
      );

      res.status(200).json(userUpdated);
    });
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const updatePasswordByEmail = async (req, res) => {
  let errorCodeResponse = 502;
  try {
    const newPassword = req.body.newPassword;

    const decodeToken = await authRequestResetPassword(req, res);

    if (!decodeToken) {
      errorCodeResponse = 401;
      throw new Error("Invalid Authenticacion");
    }

    console.log(decodeToken);
    bcrypt.hash(newPassword, 10, async (err, hash) => {
      if (err) {
        throw new Error({ messageError: "Internal server error" });
      }

      const passwordUpdated = await UserModel.updatePasswordUserByEmail(
        hash,
        decodeToken.mail
      );

      res.status(200).json(passwordUpdated);
    });
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    let userFound;
    const idUser = req.params.id;
    const { name, lastname } = req.body;

    userFound = await findUserByIdUser(idUser);
    if (!userFound.length > 0) {
      throw new Error("User not found");
    }
    const validAuth = await authRequest(req, res);

    if (!validAuth) {
      throw new Error("Invalid Authentication");
    }

    const userUpdated = await UserModel.updateUser(
      name,
      lastname,
      userFound[0].email,
      userFound[0].passwordUser,
      userFound[0].idUser
    );

    if (!userUpdated) {
      throw new Error("User not updated");
    }

    userFound = await findUserByIdUser(idUser);
    res.status(200).json(userFound[0]);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const updateEmailUser = async (req, res) => {
  const newEmail = req.body.newEmail;
  const password = req.body.password;

  let userFound;
  try {
    const validAuth = await authRequest(req, res);

    if (!validAuth) {
      throw new Error("Invalid Authentication");
    }

    const userEmailUsed = await findUserByEmail(newEmail);

    if (userEmailUsed.length > 0) {
      throw new Error("Updated failed, email in use");
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
      throw new Error("Updated failed, invalid password");
    }
    let resultUpdated = await UserModel.updateEmailUserById(
      newEmail,
      validAuth.idUser
    );

    if (resultUpdated) {
      userFound = await findUserByIdUser(validAuth.idUser);

      if (!userFound.length > 0) {
        throw new Error("User not found");
      }
      res.status(200).json(userFound[0]);
    }
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};
