import nodemailer from "nodemailer";
import { connectionMysql } from "../config/database.js";

export class ResetPassword {
  #user;
  #token;
  #newPassword;

  set propUser(value) {
    if (value == null) throw new Error("User can not be null");

    this.#user = value;
  }
  get propUser() {
    return this.#user;
  }

  set propToken(value) {
    if (!value || value.length == 0) throw new Error("token undefined");

    this.#token = value;
  }
  get propToken() {
    return this.#token;
  }

  set propNewPassword(value) {
    let regexPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;

    if (!regexPassword.test(value))
      throw new Error(
        "Weak password (min 8 chars and must has mayus and minus letters and some number)"
      );
    this.#newPassword = value;
  }

  get propNewPassword() {
    return this.#newPassword;
  }

  async patchPasswordUserByEmail() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "Update users set passwordUser=? where email=?",
        [this.propNewPassword, this.propUser.email]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  sendEmailToReset = async () => {
    if (!process.env.APP_MAIL) throw new Error("App mail not declared");

    if (!process.env.PASSWORD_APP_MAIL)
      throw new Error("App password mail not declared");

    if (!process.env.LOCALHOST_URL_FRONT)
      throw new Error("Localhost url frontend not declared");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_MAIL,
        pass: process.env.PASSWORD_APP_MAIL
      }
    });

    const info = await transporter.sendMail({
      from: process.env.APP_MAIL,
      to: this.propUser.email,
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
            <p>Hello!, we have received a request to change password for username <a style="font-weight: bold;">${this.propUser.email}</a>.</p>
            <p>Please enter the following link to set a new password</p>
            <a style="text-decoration: underline; color:blue;" href="${process.env.LOCALHOST_URL_FRONT}/newPassword?token=${this.propToken}">New Password </a>
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
  };
}
