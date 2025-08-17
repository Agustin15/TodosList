import { connectionMysql } from "../config/database.js";

export class Rol {
  #idRol;
  #name;

  set propIdRol(value) {
    if (typeof value != "number") throw new Error("idRol must be a number");

    this.#idRol = value;
  }
  get propIdRol() {
    return this.#idRol;
  }
  set propName(value) {
    if (typeof value != "string" || !this.#verifyValidString(value))
      throw new Error("Invalid rol name");
    this.#name = this.#toUpperCase(value);
  }
  get propName() {
    return this.#name;
  }
  #verifyValidString(value) {
    let valid = true;
    for (let f = 0; f < value.length; f++) {
      if (!value[f].match(/[a-z]/i) || [f] == "") {
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

  async getRolByName() {
    try {
      const [results] = await connectionMysql.connectionCreated.execute(
        "select * from rols where rol=?",
        [this.propName]
      );

      if (results.length == 0) return null;
      else return results[0];
    } catch (error) {
      throw new Error(error);
    }
  }
}
