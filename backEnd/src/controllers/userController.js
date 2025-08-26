import { UserService } from "../services/userService.js";
import { authRequest } from "../auth/auth.js";

export const createUser = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null", {
        cause: { code: 400 }
      });
    }
    const userToAdd = req.body;

    const userCreated = await UserService.createUser(userToAdd);

    res.status(201).json(userCreated);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    if (!req.params.email) {
      throw new Error("email undefined", {
        cause: { code: 400 }
      });
    }

    const email = req.params.email;
    const userFound = await UserService.getUserByEmail(email);
    res.status(200).json(userFound);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error });
  }
};

export const getUserDataByToken = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);

    let userFound = await UserService.findUserByIdUser(validAuth.idUser);
    userFound.name = userFound.nameUser;
    delete userFound.nameUser;

    res.status(200).json(userFound);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const updatePasswordUserById = async (req, res) => {
  try {
    const decodeTokenAuth = await authRequest(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null", {
        cause: { code: 400 }
      });
    }

    if (!req.body.password)
      throw new Error("Password undefined", {
        cause: { code: 400 }
      });

    if (!req.body.currentPassword)
      throw new Error("Current password undefined", {
        cause: { code: 400 }
      });

    const newPassword = req.body.password;
    const currentPassword = req.body.currentPassword;

    const userUpdated = await UserService.updatePasswordUserById(
      decodeTokenAuth.idUser,
      newPassword,
      currentPassword
    );

    res.status(200).json(userUpdated);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    await authRequest(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null", {
        cause: { code: 400 }
      });
    }
    if (!req.params.id)
      throw new Error("idUser undefined", {
        cause: { code: 400 }
      });

    if (!req.body.name)
      throw new Error("Name undefined", {
        cause: { code: 400 }
      });
    if (!req.body.lastname)
      throw new Error("Lastname undefined", {
        cause: { code: 400 }
      });

    const idUser = req.params.id;
    const { name, lastname } = req.body;

    const userUpdated = await UserService.updateUserById(
      name,
      lastname,
      idUser
    );

    res.status(200).json(userUpdated);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};

export const updateEmailUser = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);
    if (!req.body.newEmail) {
      throw new Error("New email undefined", {
        cause: { code: 400 }
      });
    }
    if (!req.body.password) {
      throw new Error("Password undefined", {
        cause: { code: 400 }
      });
    }

    const newEmail = req.body.newEmail;
    const password = req.body.password;

    let userUpdated = await UserService.updateEmailUser(
      newEmail,
      password,
      validAuth.idUser
    );
    res.status(200).json(userUpdated);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 500)
      .json({ messageError: error.message });
  }
};
