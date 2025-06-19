import connection from "../config/database.js";

export class User {
  async addUser(name, lastname, email, password) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO users (nameUser,lastname,email,passwordUser) VALUES (?,?,?,?)",
        [name, lastname, email, password]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePasswordUserById(password, idUser) {
    try {
      const [result] = await connection.execute(
        "Update users set passwordUser=? where idUser=?",
        [password, idUser]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePasswordUserByEmail(password, email) {
    try {
      const [result] = await connection.execute(
        "Update users set passwordUser=? where email=?",
        [password, email]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateEmailUserById(email, idUser) {
    try {
      const [result] = await connection.execute(
        "Update users set email=? where idUser=?",
        [email, idUser]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(name, lastname, email, password, idUser) {
    try {
      const [result] = await connection.execute(
        "Update users set nameUser=?,lastname=?,email=?,passwordUser=? where idUser=?",
        [name, lastname, email, password, idUser]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByEmail(email) {
    try {
      const [results] = await connection.execute(
        "select * from users where email=?",
        [email]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(idUser) {
    try {
      const [results] = await connection.execute(
        "select * from users where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
