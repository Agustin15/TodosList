import bcrypt from "bcrypt";
import { UserModel } from "../model/userModel.js";
import jwt from "jsonwebtoken";
import authRequest from "../auth/auth.js";

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
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(
        { email: emailFound.email },
        secretKeyRefresh,
        {
          expiresIn: "24h",
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

    const decodeTokenAuth = authRequest(req);
    console.log(mail);

    if (decodeTokenAuth) {
      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          throw new Error({ messageError: "Internal server error" });
        }

        const userUpdated = await UserModel.updateOne(
          { email: mail },
          {
            $set: { password: hash },
          }
        );

        res.status(200).json(userUpdated);
      });
    }
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};
