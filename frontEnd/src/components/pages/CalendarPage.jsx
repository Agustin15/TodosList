import { CalendarEvents } from "../calendarEvents/CalendarEvents";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FormTaskProvider } from "../../context/formTaskContext/FormTaskContext";
import { TaskProvider } from "../../context/TaskContext";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
import { MenuProvider } from "../../context/MenuContext";
import { WindowSizeProvider } from "../../context/WindowSizeContext";
export const CalendarPage = () => {
  return (
    <TaskProvider>
      <FormTaskProvider>
        <WindowSizeProvider>
          <SubscriptionProvider>
            <MenuProvider>
              <CalendarEventsProvider>
                <CalendarEvents />
              </CalendarEventsProvider>
            </MenuProvider>
          </SubscriptionProvider>
        </WindowSizeProvider>
      </FormTaskProvider>
    </TaskProvider>
  );
};
