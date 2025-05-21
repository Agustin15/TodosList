import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { authRequestResetPassword } from "../auth/auth.js";

import {
  findUserByEmail,
  updatePasswordByEmail
} from "../controllers/userController.js";

export const resetPasswordRoutes = express.Router();

resetPasswordRoutes.get("/", async function (req, res) {
  const decodeToken = await authRequestResetPassword(req, res);
  res.status(200).json(decodeToken);
});
resetPasswordRoutes.patch("/", updatePasswordByEmail);
resetPasswordRoutes.post("/", async (req, res) => {
  let errorCodeResponse = 500;
  try {
    const mail = req.body.mail;
    const secretKey = process.env.JWT_SECRET_KEY;

    const userFound = await findUserByEmail(mail);
    if (!userFound || !userFound.length > 0) {
      errorCodeResponse = 404;
      throw new Error("Email not recognized");
    }
    const tokenResetPassword = jwt.sign({ mail: mail }, secretKey, {
      algorithm: "HS256",
      expiresIn: "15m"
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_APP_MAIL
      }
    });

    async function main() {
      const info = await transporter.sendMail({
        from: process.env.USER_MAIL,
        to: mail,
        subject: "Reset password",
        html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>

    <div style="color:black;">

        <div>
            <div class="title">
                <h3>Password reset TODOLIST </h3>
            </div>
            <p>Hello!, we have received a request to change password for username <a style="font-weight: bold;">${mail}</a>.</p>
            <p>Please enter the following link to set a new password</p>
            <a style="text-decoration: underline; color:blue;" href="http://localhost:5173/newPassword?token=${tokenResetPassword}">New Password </a>
        </div>
        <div>
            <p>If you are not the one who should receive this message, please ignore it.</p>
             <p>Link is valid by 15 minutes.</p>
        </div>
    </div>
</body>

</html>`
      });

      return info.messageId;
    }
    const idMessage = await main().catch(console.error);
    if (idMessage) {
      res.status(200).json(idMessage);
    }
  } catch (error) {
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
});
