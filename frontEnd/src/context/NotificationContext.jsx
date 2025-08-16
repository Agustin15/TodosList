import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loaderNotifications, setLoaderNotifications] = useState(true);

  useEffect(() => {
    fetchGetNotifications();
  }, []);

  useEffect(() => {
    if (socket) getNotificationRealTime();
  }, [socket]);

  const getNotificationRealTime = () => {
    socket.on("newNotifications", (notifications) => {
      if (notifications && notifications.length > 0) {
        setNotifications(notifications);
      }
    });
  };

  const formatToStringDate = (date) => {
    let dateTask = new Date(date);

    let datetimeString = new Intl.DateTimeFormat("en-UY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(dateTask);

    return datetimeString;
  };

  const datetimeNotification = (dateNotification) => {
    const notificationDate = new Date(dateNotification);

    let differenceBetweenDates = Date.now() - notificationDate.getTime();

    let minutesAgoNotification = Math.ceil(differenceBetweenDates / 60000);
    let formatAgo;

    switch (true) {
      case minutesAgoNotification <= 59:
        formatAgo = displayDateAgo(
          minutesAgoNotification,
          1,
          "minutes",
          "minute"
        );
        break;

      case minutesAgoNotification >= 60 && minutesAgoNotification <= 1439:
        formatAgo = displayDateAgo(minutesAgoNotification, 60, "hours", "hour");
        break;

      case minutesAgoNotification >= 1440 && minutesAgoNotification < 43799:
        formatAgo = displayDateAgo(minutesAgoNotification, 1440, "days", "day");
        break;
      case minutesAgoNotification >= 43800 && minutesAgoNotification < 525599:
        formatAgo = displayDateAgo(
          minutesAgoNotification,
          43800,
          "months",
          "month"
        );

      case minutesAgoNotification >= 525600:
        formatAgo = displayDateAgo(
          minutesAgoNotification,
          525600,
          "years",
          "year"
        );
        break;
    }
    return formatAgo;
  };

  const displayDateAgo = (
    minutes,
    numberCondition,
    timePlural,
    timeSingular
  ) => {
    return `Ago ${Math.ceil(minutes / numberCondition)} ${
      minutes > numberCondition ? timePlural : timeSingular
    }`;
  };

  const fetchPatchStateNotification = async (notification) => {
    try {
      const response = await fetch(
        "/api/notification/" + notification.idNotification,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({ newState: "seen" })
        }
      );

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw result.messageError;
      }
      return result;
    } catch (error) {
      console.log(error);
    } finally {
       location.href = "/tasks?idTask=" + notification.idTask;
    }
  };

  const fetchGetNotifications = async () => {
    let data;
    try {
      const response = await fetch("/api/notification/", {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        throw result.messageError;
      }
      data = result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoaderNotifications(false);
      setNotifications(data ? data : notifications);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        fetchPatchStateNotification,
        formatToStringDate,
        datetimeNotification,
        notifications,
        loaderNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
