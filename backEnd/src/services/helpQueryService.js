import { HelpQuery } from "../model/helpQueryModel.js";

export const helpQueryService = {
  sendEmailQuery: async (name, description, emailClient, files) => {
    try {
      const helpQuery = new HelpQuery(name, description, emailClient, files);
      const querySent = await helpQuery.sendQuery();

      return querySent;
    } catch (error) {
      throw error;
    }
  }
};
