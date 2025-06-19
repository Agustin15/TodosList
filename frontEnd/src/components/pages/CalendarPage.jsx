import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FormTaskProvider } from "../../context/formTaskContext/FormTaskContext";
import { TaskProvider } from "../../context/TaskContext";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
import { MenuProvider } from "../../context/MenuContext";
export const CalendarPage = () => {
  return (
    <TaskProvider>
      <FormTaskProvider>
        <SubscriptionProvider>
          <MenuProvider>
            <CalendarEventsProvider>
              <CalendarEvents />
            </CalendarEventsProvider>
          </MenuProvider>
        </SubscriptionProvider>
      </FormTaskProvider>
    </TaskProvider>
  );
};
