import { connectionMysql } from "../config/database.js";

export class User {
  #name;
  #lastname;
  #emailAddress;
  #password;
  #idUser;

  get propIdUser() {
    return this.#idUser;
  }

  set propIdUser(value) {
    if (typeof value != "number")
      throw new Error("Invalid idUser,it must be a number");
    this.#idUser = value;
  }
  get propName() {
    return this.#name;
  }

  set propName(value) {
    if (!value || value.length == 0 || !this.#verifyValidString(value))
      throw new Error("Enter a valid name");
    this.#name = this.#toUpperCase(value).trim();
  }
  get propLastname() {
    return this.#lastname;
  }

  set propLastname(value) {
    if (!value || value.length == 0 || !this.#verifyValidString(value))
      throw new Error("Enter a valid lastname");

    this.#lastname = this.#toUpperCase(value).trim();
  }
  get propEmailAddress() {
    return this.#emailAddress;
  }

  set propEmailAddress(value) {
    let regexEmail = /\S+@\S+\.\S+/;

    if (!value || !regexEmail.test(value))
      throw new Error("Enter a valid email");

    this.#emailAddress = value.trim();
  }

  get propPassword() {
    return this.#password;
  }

  set propPassword(value) {
    let regexPassword = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;

    if (!regexPassword.test(value))
      throw new Error(
        "Weak password (min 8 chars and must has mayus and minus letters and some number)"
      );
    this.#password = value.trim();
  }

  #verifyValidString(value) {
    let valid = true;
    for (let f = 0; f < value.length; f++) {
      if (!/[a-z]/i.test(value) || [f] == "") {
        return false;
      }
    }
    return valid;
  }
  #toUpperCase(value) {
    let newValue = [...value].map((letter, index) => {
      if (index == 0) {
        return letter.toUpperCase();
      }
      return letter;
    });
    return newValue.join("");
  }

  async post() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "INSERT INTO users (nameUser,lastname,email,passwordUser) VALUES (?,?,?,?)",
        [
          this.propName,
          this.propLastname,
          this.propEmailAddress,
          this.propPassword
        ]
      );

      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchPasswordUserById() {
    try {
      const [result] = await connectionMysql.connectionMysql.execute(
        "Update users set passwordUser=? where idUser=?",
        [this.propPassword, this.propIdUser]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async patchPasswordUserByEmail() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "Update users set passwordUser=? where email=?",
        [this.propPassword, this.propEmailAddress]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }
  async patchEmailUserById() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "Update users set email=? where idUser=?",
        [this.propEmailAddress, this.propIdUser]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async put() {
    try {
      const [result] = await connectionMysql.connectionCreated.execute(
        "Update users set nameUser=?,lastname=?,email=?,passwordUser=? where idUser=?",
        [
          this.propName,
          this.propLastname,
          this.propEmailAddress,
          this.propPassword,
          this.propIdUser
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserByEmail() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from users where email=?",
        [this.propEmailAddress]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from users where idUser=?",
        [this.propIdUser]
      );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }
}
