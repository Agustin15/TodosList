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
    let errorCodeResponse = error.message.includes("Authentication")
      ? 401
      : 404;
    res.status(errorCodeResponse).json({ messageError: error.message });
  }
};
