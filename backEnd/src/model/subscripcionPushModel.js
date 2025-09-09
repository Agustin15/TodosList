import { connectionMysql } from "../config/database.js";

export class SubscriptionPush {
  #idUser;
  #endpointURL;
  #p256dh;
  #auth;

  get propIdUser() {
    return this.#idUser;
  }

  set propIdUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idUser = value;
  }
  get propEndpointURL() {
    return this.#endpointURL;
  }

  set propEndpointURL(value) {
    if (!value || value.length == 0)
      throw new Error("Enter subscription endpoint");
    this.#endpointURL = value;
  }

  get propKeyp256dh() {
    return this.#p256dh;
  }

  set propKeyp256dh(value) {
    if (!value || value.length == 0)
      throw new Error("Enter subscription public client key");
    this.#p256dh = value;
  }
  get propAuth() {
    return this.#auth;
  }

  set propAuth(value) {
    if (!value || value.length == 0)
      throw new Error("Enter subscription auth key");
    this.#auth = value;
  }

  async post() {
    try {
      const [result] = await connectionMysql.pool.query(
        "INSERT INTO subscriptions (endpointURL,p256dh,auth,idUser) values (?,?,?,?)",
        [
          this.propEndpointURL,
          this.propKeyp256dh,
          this.propAuth,
          this.propIdUser
        ]
      );

      return result.affectedRows;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async delete(connection) {
    try {
      let sqlQuery = "delete from subscriptions where endpointURL=?";
      let params = [this.propEndpointURL];

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
  async getSubscriptionsByIdUser(connection) {
    try {
      let sqlQuery = "select * from subscriptions where idUser=?";
      let params = [this.propIdUser];

      if (connection) {
        const [results] = await connectionMysql.execute(sqlQuery, params);
        return results;
      } else {
        const [results] = await connectionMysql.pool.query(sqlQuery, params);
        return results;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSubscriptionByEndpoint() {
    try {
      const [results] = await connectionMysql.pool.query(
        "select * from subscriptions where endpointURL=?",
        [this.propEndpointURL]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
