import { Notifications } from "../notifications/Notifications";
import { MenuProvider } from "../../context/MenuContext";
import { UserDataProvider } from "../../context/userDataContext";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
export const NotificationsPage = () => {
  return (
    <UserDataProvider>
      <MenuProvider>
        <SubscriptionProvider>
          <Notifications></Notifications>
        </SubscriptionProvider>
      </MenuProvider>
    </UserDataProvider>
  );
};
