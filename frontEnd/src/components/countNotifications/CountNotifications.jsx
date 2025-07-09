import styles from "./CountNotifications.module.css";
import { useCountNotifications } from "../../context/CountNotificationsContext";
import { useEffect } from "react";

export const CountNotifications = () => {
  const { countNotificationsNotSeen, fetchGetNotificationsByState } =
    useCountNotifications();

  useEffect(() => {
    fetchGetNotificationsByState("sent");
  }, []);
  return (
    <div className={styles.count}>
      <span>{countNotificationsNotSeen}</span>
    </div>
  );
};
