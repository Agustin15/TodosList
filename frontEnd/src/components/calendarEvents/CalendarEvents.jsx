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
import styles from "./CalendarEvents.module.css";
import { Wrapper } from "./styledWrapper.js";
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
