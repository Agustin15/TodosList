import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import styled from "styled-components";
import styles from "./CalendarEvents.module.css";
import { useTasks } from "../../context/TaskContext";

export const CalendarEvents = () => {
  const [eventsCalendar, setEventsCalendar] = useState([]);
  const [eventAdded, setEventAdded] = useState(false);
  const { formatDate } = useTasks();
  const [modalAdd, setModalAdd] = useState(false);
  const [dateSelected, setDateSelected] = useState();

  useEffect(() => {
    getTasksForCalendar();
  }, [eventAdded]);

  useEffect(() => {
    if (dateSelected) {
      console.log(dateSelected);
      setModalAdd(true);
    }
  }, [dateSelected]);

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
      background: linear-gradient(rgb(245, 245, 245), rgb(218, 218, 218));
      box-shadow: 2px 2px 2px gray;
      border: 1px solid rgb(204, 204, 204);
      color: rgb(90, 90, 90);
    }

    .fc-dayGridMonth-button {
      border: none;
    }

    .fc-button-group button:hover {
      background: linear-gradient(rgb(204, 201, 201), rgb(218, 218, 218));
      border: 1px solid rgb(204, 204, 204);
      color: rgb(90, 90, 90);
    }
    .fc-today-button {
      background: linear-gradient(rgb(161, 161, 161), rgb(95, 95, 95));
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
  const handleEventAddEvent = (info) => {
    if (info.date >= new Date()) {
      let date = new Date(info.date).getTime() + 24 * 60 * 60;
      setDateSelected(formatDate(date));
    }
  };

  return (
    <>
      <div className={styles.containCalendar}>
        <Wrapper>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              multiMonthPlugin,
              interactionPlugin,
              timeGridPlugin
            ]}
            initialView="dayGridMonth"
            events={eventsCalendar}
            height={464}
            dayMaxEventRows={1}
            dateClick={handleEventAddEvent}
            headerToolbar={{
              start: "dayGridMonth,timeGridDay,multiMonthYear",
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
      {modalAdd && (
        <Modal>
          <AddTodoForm
            setEventAdded={setEventAdded}
            dateSelected={dateSelected}
            setOpenModalAdd={setModalAdd}
          ></AddTodoForm>
        </Modal>
      )}
    </>
  );
};
