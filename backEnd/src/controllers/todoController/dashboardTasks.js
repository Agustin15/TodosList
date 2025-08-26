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
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
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
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getDataForChartTasksMonthly = async (req, res) => {
  try {
    const validAuthRequest = await authRequest(req, res);

    if (!req.params)
      throw new Error("params request null", {
        cause: { code: 400 }
      });

    if (!JSON.parse(req.params.optionGetTasks).year)
      throw new Error("year undefined", {
        cause: { code: 400 }
      });

    let year = JSON.parse(req.params.optionGetTasks).year;

    let quantityTasksByMonths =
      await DashboardTasksService.getDataForChartTasksMonthly(
        validAuthRequest.idUser,
        year
      );

    res.status(200).json(quantityTasksByMonths);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
