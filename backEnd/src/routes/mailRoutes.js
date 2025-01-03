import express from "express";
import nodemailer from "nodemailer";

export const mailRoutes = express.Router();

mailRoutes.post("/", async (req, res) => {
  const mail = req.body.mail;
  const username = req.body.username;

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
            <p>Hello!, we have received a request to change password for username <a style="font-weight: bold;">${username}</a>.</p>
            <p>Please enter the following link to set a new password</p>
            <a style="text-decoration: underline; color:blue;" href="">New Password </a>
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

  try {
    const idMessage = await main().catch(console.error);
    if (idMessage) {
      res.status(200).json(idMessage);
    }
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
});
