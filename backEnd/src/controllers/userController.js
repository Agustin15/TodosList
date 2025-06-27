import { UserService } from "../services/userService.js";
import { authRequest, authRequestResetPassword } from "../auth/auth.js";

export const createUser = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }
    const userToAdd = req.body;

    let regexEmail = /\S+@\S+\.\S+/;
    let regexPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;

    if (
      !userToAdd.name ||
      userToAdd.name.length == 0 ||
      !UserService.verifyValidString(userToAdd.name)
    )
      throw new Error("Invalid name");

    if (
      !userToAdd.lastname ||
      userToAdd.lastname.length == 0 ||
      !UserService.verifyValidString(userToAdd.lastname)
    )
      throw new Error("Invalid lastname");

    if (!userToAdd.email || !regexEmail.test(userToAdd.email))
      throw new Error("Invalid format email");

    if (!userToAdd.password || !regexPassword.test(userToAdd.password))
      throw new Error(
        "Invalid format password,it must be minime eight characters and must has mayus and minus letters and some number"
      );

    const userCreated = await UserService.createUser(userToAdd);

    res.status(201).json(userCreated);
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

    let regexEmail = /\S+@\S+\.\S+/;

    if (!regexEmail.test(email)) throw new Error("Invalid format email");

    const userFound = await UserService.getUserByEmail(email);
    res.status(200).json(userFound);
  } catch (error) {
    res.status(502).json({ messageError: error });
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
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updatePasswordUserById = async (req, res) => {
  try {
    const decodeTokenAuth = await authRequest(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    if (!req.body.password) throw new Error("Password undefined");
    if (!req.body.currentPassword)
      throw new Error("Current password undefined");

    const newPassword = req.body.password;
    const currentPassword = req.body.currentPassword;
    let regexPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;

    if (!regexPassword.test(newPassword))
      throw new Error(
        "Invalid format password,it must be minime eight characters and must has mayus and minus letters and some number"
      );

    const userUpdated = await UserService.updatePasswordUserById(
      decodeTokenAuth.idUser,
      newPassword,
      currentPassword
    );

    console.log(userUpdated);
    res.status(200).json(userUpdated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updatePasswordByEmail = async (req, res) => {
  try {
    const decodeToken = await authRequestResetPassword(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }

    if (!req.body.newPassword) throw new Error("New password undefined");
    const newPassword = req.body.newPassword;

    let regexPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;

    if (!regexPassword.test(newPassword))
      throw new Error(
        "Invalid format password,it must be minime eight characters and must has mayus and minus letters and some number"
      );

    const passwordUpdated = await UserService.updatePasswordByEmail(
      decodeToken.mail,
      newPassword
    );

    res.status(200).json(passwordUpdated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    await authRequest(req, res);

    if (Object.values(req.body).length == 0) {
      throw new Error("Body request null");
    }
    if (!req.params.id) throw new Error("idUser undefined");

    if (!req.body.name) throw new Error("Name undefined");
    if (!req.body.lastname) throw new Error("Lastname undefined");

    const idUser = req.params.id;
    const { name, lastname } = req.body;

    if (!UserService.verifyValidString(name)) throw new Error("Invalid name");
    if (!UserService.verifyValidString(lastname))
      throw new Error("Invalid lastname");

    const userUpdated = await UserService.updateUserById(
      name,
      lastname,
      idUser
    );

    res.status(200).json(userUpdated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};

export const updateEmailUser = async (req, res) => {
  try {
    const validAuth = await authRequest(req, res);
    if (!req.body.newEmail) {
      throw new Error("New email undefined");
    }
    if (!req.body.password) {
      throw new Error("Password undefined");
    }

    const newEmail = req.body.newEmail;
    const password = req.body.password;
    let regexEmail = /\S+@\S+\.\S+/;

    if (!regexEmail.test(newEmail)) throw new Error("Invalid format email");

    let userUpdated = await UserService.updateEmailUser(
      newEmail,
      password,
      validAuth.idUser
    );
    res.status(200).json(userUpdated);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 502;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
