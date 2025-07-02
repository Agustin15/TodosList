import { DashboardTasksService } from "../../services/todoService/dashboardTasksService.js";
import { authRequest } from "../../auth/auth.js";

export const getTasksByWeekday = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    let tasks = await DashboardTasksService.getTasksByWeekday(
      validAuthRequest.idUser
    );

    res.status(200).json(tasks);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};


export const getTasksThisWeekUser = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    let tasksThisWeekUser = await DashboardTasksService.getTasksThisWeekUser(
      validAuthRequest.idUser
    );

    res.status(200).json(tasksThisWeekUser);
  } catch (error) {
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
