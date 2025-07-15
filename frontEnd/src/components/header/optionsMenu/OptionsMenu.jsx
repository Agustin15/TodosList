import iconMenuTask from "../../../assets/img/iconTaskMenu.png";
import panelIcon from "../../../assets/img/dashboard.png";
import calendarMenu from "../../../assets/img/calendarMenu.png";
import iconFilesSaved from "../../../assets/img/filesMenu.png";
import classesStyle from "./OptionsMenu.module.css";
import notificationIcon from "../../../assets/img/notificationMenu.png";
import { CountNotificationsProvider } from "../../../context/CountNotificationsContext";
import { CountNotifications } from "../../countNotifications/CountNotifications";
import { useSubscription } from "../../../context/SubscriptionContext";

export const OptionsMenu = () => {
  const { subscribed } = useSubscription();
  return (
    <ul className={classesStyle.menu}>
      <li
        className={
          location.href.indexOf("/dashboard") > -1
            ? classesStyle.optionCurrent
            : ""
        }
      >
        <a href="/dashboard">
          <img src={panelIcon}></img>
          <span>Dashboard</span>
        </a>
      </li>
      <li
        className={
          location.href.indexOf("/tasks") > -1 ? classesStyle.optionCurrent : ""
        }
      >
        <a href="/tasks">
          <img src={iconMenuTask}></img>
          <span>Tasks</span>
        </a>
      </li>
      <li
        className={
          location.href.indexOf("/calendar") > -1
            ? classesStyle.optionCurrent
            : ""
        }
      >
        <a href="/calendar">
          <img src={calendarMenu}></img>
          <span>Calendar</span>
        </a>
      </li>

      <li
        className={
          location.href.indexOf("/files") > -1 ? classesStyle.optionCurrent : ""
        }
      >
        <a href="/files">
          <img
            className={classesStyle.iconFilesSaved}
            src={iconFilesSaved}
          ></img>
          <span>Files</span>
        </a>
      </li>

      <li
        className={
          location.href.indexOf("/activity") > -1
            ? classesStyle.optionCurrent
            : ""
        }
      >
        <a href="/activity">
          {subscribed && (
            <CountNotificationsProvider>
              <CountNotifications />
            </CountNotificationsProvider>
          )}

          <img src={notificationIcon}></img>
          <span>Activity</span>
        </a>
      </li>
    </ul>
  );
};
