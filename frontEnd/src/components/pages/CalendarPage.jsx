import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { TaskProvider } from "../../context/TaskContext";
export const CalendarPage = () => {
  return (
    
      <FormTaskProvider>
        <TaskProvider>
          <CalendarEventsProvider>
            <CalendarEvents />
          </CalendarEventsProvider>
        </TaskProvider>
      </FormTaskProvider>
    
  );
};
