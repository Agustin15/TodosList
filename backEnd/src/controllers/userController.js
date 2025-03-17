import bcrypt from "bcrypt";
import { UserModel } from "../model/userModel.js";
import jwt from "jsonwebtoken";
import authRequest from "../auth/auth.js";
import { updateUserOfAllTasks } from "./todoController.js";

export const createUser = async (req, res) => {
  try {
    const userToAdd = req.body;
    const userFoundByEmail = await findUserByEmail(userToAdd.email);

    if (userFoundByEmail) {
      throw new Error("Email is already taken");
    }

    const saltRounds = 10;
    bcrypt.hash(userToAdd.password, saltRounds, async (err, hash) => {
      if (err) {
        throw new Error({ messageError: "Internal server error" });
      }

      userToAdd.password = hash;
      const userCreated = await UserModel.create(userToAdd);
      res.status(201).json(userCreated);
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const userFound = await UserModel.findOne({ email: email });
    res.status(200).json(userFound);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const findUserByEmail = async (email) => {
  try {
    const userFound = await UserModel.findOne({ email: email });
    return userFound;
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const verifyUserLogin = async (req, res) => {
  const { email, password } = req.body;
  const secretKey = process.env.JWT_SECRET_KEY;
  const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;

  try {
    const emailFound = await findUserByEmail(email);

    if (!emailFound) {
      throw new Error("Authentication failed,invalid user entered");
    }

    let verifyPassword = await bcrypt.compare(password, emailFound.password);
    if (!verifyPassword) {
      throw new Error("Authentication failed,invalid password entered");
    } else {
      const token = jwt.sign({ email: emailFound.email }, secretKey, {
        expiresIn: "1h"
      });

      const refreshToken = jwt.sign(
        { email: emailFound.email },
        secretKeyRefresh,
        {
          expiresIn: "24h"
        }
      );
      res.status(200).json({ accessToken: token, refreshToken: refreshToken });
    }
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};

export const updatePasswordUserByEmail = async (req, res) => {
  try {
    const mail = req.params.mail;
    const newPassword = req.body.password;

    if (req.body.currentPassword) {
      const currentPassword = req.body.currentPassword;
      const userFound = await findUserByEmail(mail);
      if (userFound) {
        const passwordVerify = await bcrypt.compare(
          currentPassword,
          userFound.password
        );

        if (!passwordVerify) {
          throw new Error("Invalid current password");
        }
      }
    }

    const decodeTokenAuth = authRequest(req);

    if (decodeTokenAuth) {
      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          throw new Error({ messageError: "Internal server error" });
        }

        const userUpdated = await UserModel.updateOne(
          { email: mail },
          {
            $set: { password: hash }
          }
        );

        res.status(200).json(userUpdated);
      });
    }
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const updateEmailUser = async (req, res) => {
  const secretTokenKey = process.env.JWT_SECRET_KEY;
  const emailCurrent = req.params.email;
  const newEmail = req.body.newEmail;
  const password = req.body.password;

  try {
    const userFoundExisted = await findUserByEmail(newEmail);

    if (userFoundExisted) {
      throw new Error("Updated failed, email in use");
    }

    const currentUser = await findUserByEmail(emailCurrent);
    const validAuth = authRequest(req);
    if (validAuth) {
      const passwordVerify = await bcrypt.compare(
        password,
        currentUser.password
      );

      if (!passwordVerify) {
        throw new Error("Updated failed, invalid password");
      } else {
        const userUpdated = await UserModel.updateOne(
          { email: emailCurrent },
          {
            $set: { email: newEmail }
          }
        );

        if (userUpdated) {
          const tasksOfUserUpdated = await updateUserOfAllTasks(
            emailCurrent,
            newEmail
          );
          if (tasksOfUserUpdated) {
            const token = jwt.sign({ email: newEmail }, secretTokenKey, {
              expiresIn: "1h"
            });

            res.status(200).json(token);
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};
