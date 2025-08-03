import styles from "./ItemsNotifications.module.css";
import calendarNotification from "../../../assets/img/calendarNotification.png";
import notificationNotSeen from "../../../assets/img/notificacionNotSeen.png";
import notificationSeen from "../../../assets/img/notificacionSeen.png";
import { useNotification } from "../../../context/NotificationContext";
import { useWindowSize } from "../../../context/WindowSizeContext";


export const ItemsNotifications = ({ notifications }) => {
  const {
    formatToStringDate,
    fetchPatchStateNotification,
    datetimeNotification
  } = useNotification();

  const { windowWidth } = useWindowSize();

  const redirectToTask = (notification) => {
    if (notification.state == "seen")
      location.href = "/tasks?idTask=" + notification.idTask;
    else fetchPatchStateNotification(notification);
  };
  return (
    <ul className={styles.listNotifications}>
      {notifications.map((notification, index) => (
        <li
          className={notification.state == "sent" ? styles.sent : styles.seen}
          onClick={() => redirectToTask(notification)}
          key={index}
        >
          <div className={styles.stateNotification}>
            <img
              src={
                notification.state == "seen"
                  ? notificationSeen
                  : notificationNotSeen
              }
            ></img>
          </div>
          <div className={styles.icon}>
            <a>{notification.icon}</a>
          </div>
          <div className={styles.column}>
            <div className={styles.datetimeTask}>
              <img src={calendarNotification}></img>
              <p>
                {windowWidth <= 699 ? "" : "Task will expire the "}
                {formatToStringDate(notification.datetimeTask)}
              </p>
            </div>
            <div className={styles.bodyNotification}>
              <div className={styles.dataTask}>
                <p>{notification.descriptionTask}</p>
              </div>
            </div>
            <div className={styles.datetimeNotification}>
              <p>{datetimeNotification(notification.datetimeSend)}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
