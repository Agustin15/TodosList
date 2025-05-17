import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import Header from "../header/Header";
import { UserDataProvider } from "../../context/userDataContext";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
export const CalendarPage = () => {
  return (
    <>
      <UserDataProvider>
        <Header />
      </UserDataProvider>
        <CalendarEvents />
    </>
  );
};
