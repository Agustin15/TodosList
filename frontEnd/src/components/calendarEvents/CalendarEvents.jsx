import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect } from "react";
import Modal from "../modal/Modal";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import Header from "../header/Header";
import styled from "styled-components";
import styles from "./CalendarEvents.module.css";
import { UserDataProvider } from "../../context/userDataContext";
import { useParams } from "react-router-dom";
import { useCalendarEvents } from "../../context/CalendarEventsContext";
import { FilterOptionTasksProvider } from "../../context/FilterOptionTasksContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const CalendarEvents = () => {
  const {
    eventsCalendar,
    eventAdded,
    formatDate,
    setEventAdded,
    dateSelected,
    setDateSelected,
    getTasksForCalendar,
    dayView,
    initialDate
  } = useCalendarEvents();

  const [modalAdd, setModalAdd] = useState(false);
  const { idTask } = useParams();

  useEffect(() => {
    getTasksForCalendar(idTask);
  }, [eventAdded]);

  useEffect(() => {
    if (dateSelected) {
      setModalAdd(true);
    }
  }, [dateSelected]);

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
    location.href = urlFront + "tasks/" + idTask;
  };
  const handleEventAddEvent = (info) => {
    if (info.date >= new Date()) {
      let date = new Date(info.date).getTime() + 24 * 60 * 60;
      setDateSelected(formatDate(date));
    }
  };

  return (
    <div className={styles.rowCalendar}>
      <UserDataProvider>
        <Header />
      </UserDataProvider>
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
            height={544}
            initialDate={initialDate(idTask)}
            dayCellDidMount={(info) => dayView(info, idTask)}
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
          <li className={styles.found}>
            <div></div>
            Wanted
          </li>
        </ul>
      </div>
      <br></br>
      {modalAdd && (
        <Modal>
          <FilterOptionTasksProvider>
            <AddTodoForm setOpenModalAdd={setModalAdd}></AddTodoForm>
          </FilterOptionTasksProvider>
        </Modal>
      )}
    </div>
  );
};
