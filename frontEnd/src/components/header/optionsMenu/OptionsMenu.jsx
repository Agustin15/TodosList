import iconMenuTask from "../../../assets/img/iconTaskMenu.png";
import panelIcon from "../../../assets/img/dashboard.png";
import calendarMenu from "../../../assets/img/calendarMenu.png";
import iconFilesSaved from "../../../assets/img/filesMenu.png";
import classesStyle from "./OptionsMenu.module.css";
import notificationIcon from "../../../assets/img/notificationMenu.png";
import { CountNotificationsProvider } from "../../../context/CountNotificationsContext";
import { CountNotifications } from "../../countNotifications/CountNotifications";
import { useSubscription } from "../../../context/SubscriptionContext";
import { useLocation } from "react-router-dom";

export const OptionsMenu = () => {
  let location = useLocation();
  const { subscribed } = useSubscription();
  return (
    <ul className={classesStyle.menu}>
      <li
        className={
          location.pathname == "/dashboard" ? classesStyle.optionCurrent : ""
        }
      >
        <a href="/dashboard">
          <img src={panelIcon}></img>
          <span>Dashboard</span>
        </a>
      </li>
      <li
        className={
          location.pathname == "/tasks" ? classesStyle.optionCurrent : ""
        }
      >
        <a href="/tasks">
          <img src={iconMenuTask}></img>
          <span>Tasks</span>
        </a>
      </li>
      <li
        className={
          location.pathname == "/calendar" ? classesStyle.optionCurrent : ""
        }
      >
        <a href="/calendar">
          <img src={calendarMenu}></img>
          <span>Calendar</span>
        </a>
      </li>

      <li
        className={
          location.pathname == "/files" ? classesStyle.optionCurrent : ""
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
          location.pathname == "/activity" ? classesStyle.optionCurrent : ""
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
