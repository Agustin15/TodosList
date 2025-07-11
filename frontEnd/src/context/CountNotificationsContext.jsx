import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const CountNotificationsContext = createContext();

export const CountNotificationsProvider = ({ children }) => {
  const [countNotificationsNotSeen, setCountNotificationsNotSeen] = useState(0);

  const fetchGetNotificationsByState = async (state) => {
    let data;
    try {
      const response = await fetch("/api/notification/" + state, {
        method: "GET",
        headers: {
          credentials: "include"
        }
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "/login";
        throw result.messageError;
      }
      data = result;
    } catch (error) {
      console.log(error);
    } finally {
      if (data && data.length > 0) {
        setCountNotificationsNotSeen(data.length);
      }
    }
  };

  return (
    <CountNotificationsContext.Provider
      value={{
        countNotificationsNotSeen,
        fetchGetNotificationsByState,
        setCountNotificationsNotSeen
      }}
    >
      {children}
    </CountNotificationsContext.Provider>
  );
};
export const useCountNotifications = () =>
  useContext(CountNotificationsContext);
