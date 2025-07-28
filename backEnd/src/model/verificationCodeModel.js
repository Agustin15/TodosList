import connection from "../config/database.js";
import { randomInt } from "node:crypto";

export class VerificationCode {
  static min = 100000;
  static max = 999999;
  static durationCode = 60000; //(one minute in milliseconds)
  #idVerification;
  #code;
  #expirationTime;

  set propIdVerification(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idVerification = value;
  }

  get propIdVerification() {
    return this.#idVerification;
  }
  set propCode(value) {
    if (value.toString().length != 6)
      throw new Error("Code must be only of six digits");
    this.#code = value;
  }

  get propCode() {
    return this.#code;
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

  generateCode() {
    this.propCode = randomInt(VerificationCode.min, VerificationCode.max);
  }
  generateExpirationTime() {
    //expiration in 1 minute
    this.propExpirationTime = Date.now() + VerificationCode.durationCode;
  }

  async post() {
    try {
      const [result] = await connection.execute(
        "INSERT INTO verificationCode (idVerification,codeOfVerification,expirationTime) values(?,?,?)",
        [this.propIdVerification, this.propCode, this.propExpirationTime]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationCodeByCode() {
    try {
      const [results] = await connection.execute(
        "select * from verificationCode where codeOfVerification=?",
        [this.propCode]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationCodeByIdVerificationAndCode() {
    try {
      const [results] = await connection.execute(
        "select * from verificationCode where idVerification=? and codeOfVerification=?",
        [this.propIdVerification, this.propCode]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
