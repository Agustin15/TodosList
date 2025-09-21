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

  async post(connection) {
    try {
      let sqlQuery = "INSERT INTO rols_users(idRol,idUser) VALUES(?,?)";
      let params = [this.propIdRol, this.propIdUser];

      if (connection) {
        const [result] = await connection.execute(sqlQuery, params);
        return result.affectedRows;
      } else {
        const [result] = await connectionMysql.pool.query(sqlQuery, params);
        return result.affectedRows;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserRol() {
    try {
      const [result] = await connectionMysql.pool.query(
        "select * from rols_users where idUser=? and idRol=?",
        [this.propIdUser, this.propIdRol]
      );
      if (result.length == 0) return null;

      return result[0];
    } catch (error) {
      throw new Error(error);
    }
  }
}
