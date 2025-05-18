import connection from "../config/database.js";

export const UserModel = {
  addUser: async function (name, lastname, email, password) {
    try {
      const [result] = await connection.execute(
        "INSERT INTO users (nameUser,lastname,email,passwordUser) VALUES (?,?,?,?)",
        [name, lastname, email, password]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updatePasswordUserByEmail: async function (password, email) {
    try {
      const [result] = await connection.execute(
        "Update users set passwordUser=? where email=?)",
        [password, email]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateUser: async function (name, lastname, email, password, idUser) {
    try {
      const [result] = await connection.execute(
        "Update users set nameUser=?,lastname=?,email=?,passwordUser=? where idUser=?",
        [name, lastname, email, password, idUser]
      );
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserByEmail: async function (email) {
    try {
      const [results] = await connection.execute(
        "select * from users where email=?",
        [email]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getUserById: async function (idUser) {
    try {
      const [results] = await connection.execute(
        "select * from users where idUser=?",
        [idUser]
      );
      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
