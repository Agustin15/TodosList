import { UsersRols } from "../model/usersRolsModel.js";
import { RolService } from "./rolService.js";

const usersRolsModel = new UsersRols();

export const UsersRolsService = {
  addUserRol: async (idUser, connection) => {
    try {
      const rolFound = await RolService.findRolByName("User", connection);
      usersRolsModel.propIdRol = rolFound.idRol;
      usersRolsModel.propIdUser = parseInt(idUser);

      const result = await usersRolsModel.post(connection);
      if (result == 0)
        throw new Error("Failed to set rol to user", { cause: { code: 500 } });

      return result;
    } catch (error) {
      throw error;
    }
  }
};
