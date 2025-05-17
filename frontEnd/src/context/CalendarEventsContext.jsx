import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

const CalendarEventsContext = createContext();

export const CalendarEventsProvider = () => {
  const [eventsCalendar, setEventsCalendar] = useState([]);

  useEffect(() => {
    getTasksForCalendar();
  }, []);

  const getTasksForCalendar = async () => {
    const optionGetTasks = {
      option: "getTasksForCalendarByUser"
    };

    try {
      const response = await fetch(
        "/api/todos/" + JSON.stringify(optionGetTasks),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const result = await response.json();

      if (response.status == 401) {
        location.href = "/login";
      }

      if (result.length > 0) {
        setEventsCalendar(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CalendarEventsContext.Provider
      value={{ eventsCalendar }}
    ></CalendarEventsContext.Provider>
  );
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
