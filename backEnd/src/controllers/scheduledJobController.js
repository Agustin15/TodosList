import { ScheduledJob } from "../model/scheduledJobModel.js";

const scheduledJobModel=new ScheduledJob();

export const addJob = async (idNotification) => {
  try {
    let resultAdded = await scheduledJobModel.addJob(idNotification);
    if (resultAdded == 0) throw new Error("Failed to add scheduled job");

    return resultAdded;
  } catch (error) {
    throw error;
  }
};

export const getJobByIdNotification = async (idNotification) => {

  try {
    let result = await scheduledJobModel.getJobByIdNotification(idNotification);
    if (result.length == 0) throw new Error("Job of notification not found");

    return result[0];
  } catch (error) {
    throw error;
  }
};
