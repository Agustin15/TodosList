import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserService } from "../services/userService.js";

export const loginRoutes = express.Router();

loginRoutes.post("/", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.email) throw new Error("Email undefined");
    if (!req.body.password) throw new Error("password undefined");

    if (!process.env.JWT_SECRET_KEY) throw new Error("JWT secret key");
    if (!process.env.JWT_SECRET_KEY_REFRESH) throw new Error("JWT secret refresh key");

    const { email, password } = req.body;

    const secretKey = process.env.JWT_SECRET_KEY;
    const secretKeyRefresh = process.env.JWT_SECRET_KEY_REFRESH;

    let userFound = await UserService.findUserByEmail(email);

    if (!userFound) {
      throw new Error("Authentication failed,invalid user entered");
    }

    let verifyPassword = await bcrypt.compare(password, userFound.passwordUser);
    if (!verifyPassword) {
      throw new Error("Authentication failed,invalid password entered");
    } else {
      const token = jwt.sign({ idUser: userFound.idUser }, secretKey, {
        algorithm: "HS256",
        expiresIn: "1h"
      });

      const refreshToken = jwt.sign(
        { idUser: userFound.idUser },
        secretKeyRefresh,
        {
          algorithm: "HS256",
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
