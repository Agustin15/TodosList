import { connectionMysql } from "../config/database.js";
import nodemailer from "nodemailer";
import { randomInt } from "node:crypto";

export class VerificationCode {
  static min = 100000;
  static max = 999999;
  static durationCode = 300000; //(five minutes in milliseconds)
  #idVerification;
  #code;
  #codeHash;
  #expirationTime;

  set propIdVerification(value) {
    if (typeof value != "number")
      throw new Error("Invalid idVerification,it must be a number");
    this.#idVerification = value;
  }

  get propIdVerification() {
    return this.#idVerification;
  }

  set propCode(value) {
    if (value.toString().length != 6 || !this.#verifyCharsValidCode(value))
      throw new Error("Code must have only six digits");
    this.#code = value;
  }

  get propCode() {
    return this.#code;
  }
  set propCodeHash(value) {
    if (!value) throw new Error("Code hash undefined");
    this.#codeHash = value;
  }

  get propCodeHash() {
    return this.#codeHash;
  }
  set propExpirationTime(value) {
    if (!value) throw new Error("Invalid date");
    if (value <= Date.now())
      throw new Error("Expiration datetime must be higher than today datetime");
    this.#expirationTime = value;
  }

  get propExpirationTime() {
    return this.#expirationTime;
  }

  #verifyCharsValidCode(code) {
    for (let f = 0; f < code.length; f++) {
      if (!/^[0-9]$/.test(code[f])) return false;
    }
    return true;
  }
  async generateCode() {
    while (true) {
      this.propCode = randomInt(VerificationCode.min, VerificationCode.max);
      const verificationCodesFound = await this.getVerificationCodeByCode();
      if (verificationCodesFound.length == 0) break;
    }
  }
  generateExpirationTime() {
    //expiration in five minutes
    this.propExpirationTime = Date.now() + VerificationCode.durationCode;
  }

  async post() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "INSERT INTO verifications_code (codeOfVerification,expirationTime,idVerification) values(?,?,?)",
        [this.propCodeHash, this.propExpirationTime, this.propIdVerification]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationCodeByCode() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from verifications_code where codeOfVerification=?",
        [this.propCode]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationsCodeByIdVerification() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from verifications_code where idVerification=?",
        [this.propIdVerification]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendCodeByEmail(emailUser) {
    try {
      if (!process.env.APP_MAIL) throw new Error("APP MAIL not declared");
      if (!process.env.PASSWORD_APP_MAIL)
        throw new Error("PASSWORD APP MAIL not declared");

      const appEmail = process.env.APP_MAIL;
      const passwordEmailApp = process.env.PASSWORD_APP_MAIL;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: appEmail,
          pass: passwordEmailApp
        }
      });

      const emailSent = await transporter.sendMail({
        from: appEmail,
        to: emailUser,
        subject: "Todolist verification code",
        html: `<p>Hi,your one-time verification code:<h3>${this.propCode}</h3></p><br>
              <p>This code expires after 5 minutes,</p>
              <p>if you did not request this,please change your password or 
              contact us</p>`
      });

      return emailSent;
    } catch (error) {
      throw new Error(error);
    }
  }
}
