import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import iconCalendar from "../../assets/img/calendarTitle.png";
import Modal from "../modal/Modal";
import { Title } from "../title/Title";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import Header from "../header/Header";
import styled from "styled-components";
import styles from "./CalendarEvents.module.css";
import { useState, useEffect } from "react";
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
    .fc {
      height: 84vh;
    }

    .fc .fc-daygrid-day.fc-day-today {
      background-color: rgba(71, 194, 216, 0.15);
    }
    .fc-toolbar-title {
      font-size: 25px;
    }

    .fc-button-group button {
      box-shadow: 2px 2px 2px gray;
    }
    tbody td .fc-event {
      overflow: hidden;
      width: 10rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media only screen and (max-width: 699px) {
      .fc {
        width: 84vw;
        height: 71vh;
      }
      .fc-header-toolbar {
        displex: flex;
        align-items: center;
      }

      .fc-toolbar-chunk {
        display: flex;
      }

      .fc-toolbar-title {
        font-size: 18px;
        position: absolute;
        left: 1rem;
        margin-top: -2rem;
        width: 90%;
        display: flex;
        justify-content: center;
      }
      .fc-button-group button,
      .fc-today-button {
        width: 3rem;
        margin-top: 2rem;
        color: white;
        height: 2rem;
        font-size: 14px;
        display: flex;
        justify-content: center;
      }

      .fc-button-group .fc-prev-button,
      .fc-button-group .fc-next-button {
        width: 2rem;
        height: 2rem;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      tbody td {
        overflow: hidden;
      }
    }
    @media only screen and (min-width: 700px) and (max-width: 1024px) {
      tbody td .fc-event {
        overflow: hidden;
        width: 5rem;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
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
      <div className={styles.column}>
        <Title title={"Calendar tasks"} icon={iconCalendar}></Title>
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
