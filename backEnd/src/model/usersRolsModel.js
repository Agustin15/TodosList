import { connectionMysql } from "../config/database.js";

export class UsersRols {
  #idRol;
  #idUser;

  set propIdRol(value) {
    if (typeof value != "number") throw new Error("idRol must be a number");

    this.#idRol = value;
  }
  get propIdRol() {
    return this.#idRol;
  }
  set propIdUser(value) {
    if (typeof value != "number") throw new Error("idUser must be a number");

    this.#idUser = value;
  }
  get propIdUser() {
    return this.#idUser;
  }

  async post() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "INSERT INTO rols_users(idRol,idUser) VALUES(?,?)",
        [this.propIdRol, this.propIdUser]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
}
