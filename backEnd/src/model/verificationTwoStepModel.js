import { connectionMysql } from "../config/database.js";
export class VerificationTwoStep {
  #idUser;
  #idRol;
  #enabled = false;

  set propIdUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idUser = value;
  }

  get propIdUser() {
    return this.#idUser;
  }

  set propIdRol(value) {
    if (typeof value != "number")
      throw new Error("Invalid idRol,it must be a number");
    this.#idRol = value;
  }

  get propIdRol() {
    return this.#idRol;
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
        "INSERT INTO verifications_two_step (enabled,idUser,idRol) values (?,?,?)",
        [this.propEnabled, this.propIdUser, this.propIdRol]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patch() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "update verifications_two_step set enabled=? where idUser=? and idRol=?",
        [this.propEnabled, this.propIdUser, this.propIdRol]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationByUserAndRol() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from verifications_two_step where idUser=? and idRol=?",
        [this.propIdUser, this.propIdRol]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
