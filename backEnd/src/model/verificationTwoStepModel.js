import { connectionMysql } from "../config/database.js";
export class VerificationTwoStep {
  #idRolUser;
  #enabled = false;

  set propIdRolUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idRolUser,it must be a number");
    this.#idRolUser = value;
  }

  get propIdRolUser() {
    return this.#idRolUser;
  }

  set propIdRol(value) {
    if (typeof value != "number")
      throw new Error("Invalid idRol,it must be a number");
    this.#idRolUser = value;
  }

  get propIdRol() {
    return this.#idRolUser;
  }
  set propEnabled(value) {
    this.#enabled = value;
  }

  get propEnabled() {
    return this.#enabled;
  }

  async post() {
    try {
      const [result] = await connectionMysql.pool.query(
        "INSERT INTO verifications_two_step (enabled,idRolUser) values (?,?)",
        [this.propEnabled, this.propIdRol]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patch() {
    try {
      const [result] = await connectionMysql.pool.query(
        "update verifications_two_step set enabled=? where idRolUser=?",
        [this.propEnabled, this.propIdRolUser]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getVerificationByUserAndRol() {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from verifications_two_step where idRolUser=?",
        [this.propIdRolUser]
      );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
