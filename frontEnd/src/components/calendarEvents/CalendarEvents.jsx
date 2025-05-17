import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { useState, useEffect } from "react";
import iconCalendar from "../../assets/img/calendarMenu.png";
import styled from "styled-components";
import styles from "./CalendarEvents.module.css";

export const CalendarEvents = () => {
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

  const Wrapper = styled.div`
    .fc-toolbar-title {
      font-size: 25px;
    }

    .fc-button-group button {
      background: linear-gradient(rgb(9, 108, 138), rgb(9, 108, 138));
      color: white;
      border: none;
    }

    .fc-button-group button:hover {
      background: linear-gradient(rgb(8, 79, 100), rgb(21, 70, 85));
    }
    .fc-today-button {
      background: linear-gradient(rgb(9, 108, 138), rgb(12, 81, 102));
      color: white;
      border: none;
      opacity: 99%;
      cursor: pointer;
      filter: none;
    }
  `;

  const handleEventClickCalendar = (info) => {
    let idTask = info.event._def.extendedProps.idTask;
    location.href = "tasks/" + idTask;
  };

  return (
    <>
      <div className={styles.containCalendar}>
        <Wrapper>
          <FullCalendar
            plugins={[dayGridPlugin, multiMonthPlugin]}
            initialView="dayGridMonth"
            events={eventsCalendar}
            height={464}
            dayMaxEventRows={1}
            headerToolbar={{
              start: "dayGridMonth,dayGridWeek,multiMonthYear",
              center: "title",
              end: "today prev,next"
            }}
            eventClick={handleEventClickCalendar}
          ></FullCalendar>
        </Wrapper>
        <ul>
          <li className={styles.pending}>
            <div></div>
            Pending
          </li>
          <li className={styles.completed}>
            <div></div>
            Completed
          </li>
        </ul>
      </div>
      <br></br>
    </>
  );
};
