import { connectionMysql } from "../config/database.js";
export class VerificationTwoStep {
  #idUser;
  #enabled = false;

  set propIdUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idUser = value;
  }

  get propIdUser() {
    return this.#idUser;
  }
  set propEnabled(value) {
    this.#enabled = value;
  }

  get propEnabled() {
    return this.#enabled;
  }

  async post() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "INSERT INTO verifications_two_step (enabled,idUser) values (?,?)",
        [this.propEnabled, this.propIdUser]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patch() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "update verifications_two_step set enabled=? where idUser=?",
        [this.propEnabled, this.propIdUser]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationByUser() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from verifications_two_step where idUser=?",
        [this.propIdUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
