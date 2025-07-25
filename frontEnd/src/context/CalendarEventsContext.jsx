import { createContext, useEffect, useState } from "react";
import styles from "../components/calendarEvents/CalendarEvents.module.css";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";

const CalendarEventsContext = createContext();

export const CalendarEventsProvider = ({ children }) => {
  const [eventsCalendar, setEventsCalendar] = useState([]);
  const [eventAdded, setEventAdded] = useState(false);
  const [dateSelected, setDateSelected] = useState();
  const [searchParams] = useSearchParams();
  const idTaskParam = searchParams.get("idTask");

  useEffect(() => {
    if (idTaskParam && eventsCalendar.length > 0) dayViewOfTaskFound();
  }, [eventsCalendar]);

  const getTasksForCalendar = async (idTask) => {
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
        if (idTask) {
          setEventsCalendar(
            result.map((event) => {
              if (event.extendedProps.idTask == idTask) {
                event.title += " (selected)";
              }
              return event;
            })
          );
        } else {
          setEventsCalendar(result);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateViewCell = (date) => {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();

    let dateString =
      year +
      "-" +
      (month < 10 ? `0${month}` : month) +
      "-" +
      (day < 10 ? `0${day}` : day);
    return dateString;
  };

  const formatDate = (date) => {
    let dateToFormat = new Date(date);
    let year = dateToFormat.getFullYear();
    let month = dateToFormat.getMonth() + 1;
    let day = dateToFormat.getDate();
    let hour = dateToFormat.getHours();
    let minutes = dateToFormat.getMinutes();

    let dateString =
      year +
      "-" +
      (month < 10 ? `0${month}` : month) +
      "-" +
      (day < 10 ? `0${day}` : day) +
      " " +
      (hour < 10 ? `0${hour}` : hour) +
      ":" +
      (minutes < 10 ? `0${minutes}` : minutes);

    return dateString;
  };

  const initialDate = (idTask) => {
    let date = formatDate(Date());
    if (eventsCalendar.length > 0 && idTask) {
      let eventCalendar = eventsCalendar.find(
        (event) => event.extendedProps.idTask == idTask
      );

      if (eventCalendar) date = eventCalendar.date;
    }
    return date;
  };

  const dayViewOfTaskFound = () => {
    let cellDays = document
      .querySelector(".fc-daygrid-body")
      .querySelectorAll("td");

    let eventFound = eventsCalendar.find(
      (event) => event.extendedProps.idTask == idTaskParam
    );

    if (eventFound) {
      let dateTaskString = formatDateViewCell(eventFound.date);

      cellDays.forEach((cell) => {
        if (cell.dataset.date == dateTaskString)
          cell.classList.add(styles.dayOfTask);
      });
    }
  };
  return (
    <CalendarEventsContext.Provider
      value={{
        eventsCalendar,
        setEventAdded,
        eventAdded,
        formatDate,
        setDateSelected,
        dateSelected,
        getTasksForCalendar,
        idTaskParam,
        initialDate
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
