import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../controllers/userController.js";

export const loginRoutes = express.Router();

loginRoutes.post("/", async (req, res) => {
  const { email, password } = req.body;
  const secretKey = process.env.JWT_SECRET_KEY;
  const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;

  try {
    let userFound = await findUserByEmail(email);

    if (userFound.length == 0) {
      throw new Error("Authentication failed,invalid user entered");
    }

    userFound = userFound[0];

    let verifyPassword = await bcrypt.compare(password, userFound.passwordUser);
    if (!verifyPassword) {
      throw new Error("Authentication failed,invalid password entered");
    } else {
      const token = jwt.sign({ idUser: userFound.idUser }, secretKey, {
        expiresIn: "1h"
      });

      const refreshToken = jwt.sign(
        { idUser: userFound.idUser },
        secretKeyRefresh,
        {
          expiresIn: "24h"
        }
      );

      res.cookie("accessToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });

      res.status(200).json({ login: true });
    }
  } catch (error) {
    res.status(401).json({ messageError: error.message });
  }
});
