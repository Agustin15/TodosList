import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import Header from "../header/Header";
import { UserDataProvider } from "../../context/userDataContext";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { TaskProvider } from "../../context/TaskContext";
export const CalendarPage = () => {
  return (
    <>
      <UserDataProvider>
        <Header />
      </UserDataProvider>
      <FormTaskProvider>
        <TaskProvider>
          <CalendarEvents />
        </TaskProvider>
      </FormTaskProvider>
    </>
  );
};
