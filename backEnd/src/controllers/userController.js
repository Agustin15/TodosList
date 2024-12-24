import bcrypt from "bcrypt";
import { UserModel } from "../model/userModel.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const userToAdd = req.body;
    const userFoundByUserName = await findUserByUsername(userToAdd.username);

    if (userFoundByUserName) {
      throw new Error("Username is already taken");
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

const findUserByUsername = async (username) => {
  try {
    const userFound = await UserModel.findOne({ username: username });
    return userFound;
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const verifyUserLogin = async (req, res) => {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET_KEY;

  try {
    const userNameFound = await findUserByUsername(username);

    if (!userNameFound) {
      throw new Error("Authentication failed,invalid user entered");
    }

    let verifyPassword = await bcrypt.compare(password, userNameFound.password);
    if (!verifyPassword) {
      throw new Error("Authentication failed,invalid password entered");
    } else {
      const token = jwt.sign({ username: userNameFound.username }, secretKey, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
};

