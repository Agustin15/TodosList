import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { authRequestResetPassword } from "../auth/auth.js";
import { UserService } from "../services/userService.js";
import { updatePasswordByEmail } from "../controllers/userController.js";

export const resetPasswordRoutes = express.Router();

resetPasswordRoutes.get("/", async function (req, res) {
  const decodeToken = await authRequestResetPassword(req, res);
  res.status(200).json(decodeToken);
});

resetPasswordRoutes.patch("/", updatePasswordByEmail);

resetPasswordRoutes.post("/", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Body request null");
    }

    if (!req.body.mail) throw new Error("Email undefined");
    if (!process.env.JWT_SECRET_KEY)
      throw new Error("JWT secret key not declared");
    if (!process.env.APP_MAIL)
      throw new Error("App mail not declared");
     if (!process.env.PASSWORD_APP_MAIL)
      throw new Error("App password mail not declared");


    const mail = req.body.mail;
    const secretKey = process.env.JWT_SECRET_KEY;

    const userFound = await UserService.findUserByEmail(mail);
    if (!userFound) {
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
        user: process.env.APP_MAIL,
        pass: process.env.PASSWORD_APP_MAIL
      }
    });

    async function main() {
      const info = await transporter.sendMail({
        from: process.env.APP_MAIL,
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
    res.status(500).json({ messageError: error.message });
  }
});
