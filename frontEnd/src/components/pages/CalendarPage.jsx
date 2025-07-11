import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { TaskProvider } from "../../context/TaskContext";
import { MenuProvider } from "../../context/MenuContext";

export const CalendarPage = () => {
  return (
    <TaskProvider>
      <CalendarEventsProvider>
        <MenuProvider>
          <CalendarEvents />
        </MenuProvider>
      </CalendarEventsProvider>
    </TaskProvider>
  );
};
