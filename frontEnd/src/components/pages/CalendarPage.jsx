import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { TaskProvider } from "../../context/TaskContext";
import { MenuProvider } from "../../context/MenuContext";
export const CalendarPage = () => {
  return (
    <FormTaskProvider>
      <MenuProvider>
        <TaskProvider>
          <CalendarEventsProvider>
            <CalendarEvents />
          </CalendarEventsProvider>
        </TaskProvider>
      </MenuProvider>
    </FormTaskProvider>
  );
};
