import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class ConnectionPoolMysql {
  #host;
  #user;
  #name;
  #password;
  pool;

  constructor() {
    try {
      if (
        !process.env.DATABASE_HOST ||
        !process.env.DATABASE_USER ||
        !process.env.DATABASE_NAME ||
        !process.env.DATABASE_PASSWORD
      ) {
        throw new Error("Config variables of database are not defined");
      }
      this.propHost = process.env.DATABASE_HOST;
      this.propUser = process.env.DATABASE_USER;
      this.propName = process.env.DATABASE_NAME;
      this.propPassword = process.env.DATABASE_PASSWORD;

      this.#createPool();
    } catch (error) {
      console.log("Database connection failed," + error);
      process.exit(1);
    }
  }

  validation = (value, param) => {
    if (typeof value != "string" || value.length == 0)
      throw new Error("Invalid " + param);
  };
  set propHost(value) {
    this.validation(value, "Host");
    this.#host = value;
  }
  get propHost() {
    return this.#host;
  }
  set propUser(value) {
    this.validation(value, "User");
    this.#user = value;
  }
  get propUser() {
    return this.#user;
  }
  set propName(value) {
    this.validation(value, "Name");
    this.#name = value;
  }
  get propName() {
    return this.#name;
  }

  set propPassword(value) {
    this.validation(value, "Passowrd");
    this.#password = value;
  }
  get propPassword() {
    return this.#password;
  }

  #createPool = () => {
    try {
      this.pool = mysql.createPool({
        host: this.propHost,
        user: this.propUser,
        password: this.propPassword,
        database: this.propName,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });
    } catch (error) {
      console.error("Database connection failed," + error);
      process.exit(1);
    }
  };
}
export const connectionMysql = new ConnectionPoolMysql();
