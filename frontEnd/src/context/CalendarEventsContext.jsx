import { createContext, useState } from "react";
import styles from "../components/calendarEvents/CalendarEvents.module.css";
import { useContext } from "react";

const CalendarEventsContext = createContext();

export const CalendarEventsProvider = ({ children }) => {
  const [eventsCalendar, setEventsCalendar] = useState([]);
  const [eventAdded, setEventAdded] = useState(false);
  const [dateSelected, setDateSelected] = useState();

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

  const dayViewOfTaskFound = (info, idTask) => {
    let dateTodayString = formatDateViewCell(Date());

    if (eventsCalendar.length > 0 && idTask) {
      let eventCalendar = eventsCalendar.find(
        (event) => event.extendedProps.idTask == idTask
      );

      let dateTaskString = formatDateViewCell(eventCalendar.date);

      if (dateTaskString == info.el.dataset.date) {
        info.el.classList.add(styles.dayOfTask);
      }
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
        dayViewOfTaskFound,
        initialDate
      }}
    >
      {children}
    </CalendarEventsContext.Provider>
  );
};

export const useCalendarEvents = () => useContext(CalendarEventsContext);
