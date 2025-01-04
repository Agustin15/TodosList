import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  updatePasswordUserByEmail,
} from "../controllers/userController.js";

export const resetPasswordRoutes = express.Router();

resetPasswordRoutes.put("/:mail", updatePasswordUserByEmail);
resetPasswordRoutes.post("/", async (req, res) => {
  try {
    const mail = req.body.mail;
    const secretKey = process.env.JWT_SECRET_KEY;

    const tokenResetPassword = jwt.sign({ mail: mail }, secretKey, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_APP_MAIL,
      },
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
            <a style="text-decoration: underline; color:blue;" href="http://localhost:5173/newPassword?token=${tokenResetPassword}&&mail=${mail}">New Password </a>
        </div>
        <div>
            <p>If you are not the one who should receive this message, please ignore it.</p>
        </div>
    </div>
</body>

</html>`,
      });

      return info.messageId;
    }

    const userFound = await findUserByEmail(mail);
    if (!userFound) {
      throw new Error("*Email not recognized");
    }
    const idMessage = await main().catch(console.error);
    if (idMessage) {
      res.status(200).json(idMessage);
    }
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
});
