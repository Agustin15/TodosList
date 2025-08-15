import { Rol } from "../model/rolModel.js";

const rolModel = new Rol();

export const RolService = {
  findRolByName: async (name) => {
    try {
      rolModel.propName = name;
      const rolFound = await rolModel.getRolByName();
      if (!rolFound) throw new Error("Failed to found rol");

      return rolFound;
    } catch (error) {
      throw error;
    }
  }
};
