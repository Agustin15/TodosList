import { authRequest } from "../../auth/auth.js";
import { CalendarTasksService } from "../../services/todoService/calendarTasksService.js";

export const getTasksForCalendarByUser = async (req, res) => {
  let tasks;
  try {
    const validAuthRequest = await authRequest(req, res);

    tasks = await CalendarTasksService.getTasksForCalendarByUser(
      validAuthRequest.idUser
    );

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
