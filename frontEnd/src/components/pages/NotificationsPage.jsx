import { Notifications } from "../notifications/Notifications";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
import { NotificationProvider } from "../../context/NotificationContext";
import { MenuProvider } from "../../context/MenuContext";

export const NotificationsPage = () => {
  return (
    <SubscriptionProvider>
      <NotificationProvider>
        <MenuProvider>
          <Notifications></Notifications>
        </MenuProvider>
      </NotificationProvider>
    </SubscriptionProvider>
  );
};
