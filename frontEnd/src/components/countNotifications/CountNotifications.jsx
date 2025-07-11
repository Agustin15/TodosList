import styles from "./CountNotifications.module.css";
import { useCountNotifications } from "../../context/CountNotificationsContext";
import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

export const CountNotifications = () => {
  const {
    countNotificationsNotSeen,
    setCountNotificationsNotSeen,
    fetchGetNotificationsByState
  } = useCountNotifications();

  const { socket } = useSocket();

  useEffect(() => {
    fetchGetNotificationsByState("sent");
  }, []);

  useEffect(() => {
    if (socket) getQuantityNotificatiosnRealTime();
  }, [socket]);

  const getQuantityNotificatiosnRealTime = () => {
    socket.on("newNotificationsNotSeen", (notificationsNotSeen) => {
      if (notificationsNotSeen && notificationsNotSeen.length > 0)
        setCountNotificationsNotSeen(notificationsNotSeen.length);
    });
  };

  return (
    <div
      className={
        countNotificationsNotSeen > 0 ? styles.news : styles.newsHidden
      }
    >
      <span>{countNotificationsNotSeen}</span>
    </div>
  );
};
