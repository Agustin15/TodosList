import { ScheduledJob } from "../model/scheduledJobModel.js";

const scheduledJobModel = new ScheduledJob();

export const ScheduledJobService = {
  addJob: async (idNotification) => {
    try {
      scheduledJobModel.propIdNotification = idNotification;
      let resultAdded = await scheduledJobModel.post();
      if (resultAdded == 0) throw new Error("Failed to add scheduled job");

      return resultAdded;
    } catch (error) {
      throw error;
    }
  },

  getJobByIdNotification: async (idNotification) => {
    try {
      scheduledJobModel.propIdNotification = idNotification;
      let result = await scheduledJobModel.getJobByIdNotification();
      if (result.length == 0) throw new Error("Job of notification not found");

      return result[0];
    } catch (error) {
      throw error;
    }
  }
};
