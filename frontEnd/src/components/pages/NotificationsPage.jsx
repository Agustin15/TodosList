import { Notifications } from "../notifications/Notifications";
import { MenuProvider } from "../../context/MenuContext";
import { UserDataProvider } from "../../context/userDataContext";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
import { WindowSizeProvider } from "../../context/WindowSizeContext";
import { NotificationProvider } from "../../context/NotificationContext";

export const NotificationsPage = () => {
  return (
    <UserDataProvider>
      <MenuProvider>
        <WindowSizeProvider>
          <SubscriptionProvider>
            <NotificationProvider>
              <Notifications></Notifications>
            </NotificationProvider>
          </SubscriptionProvider>
        </WindowSizeProvider>
      </MenuProvider>
    </UserDataProvider>
  );
};
