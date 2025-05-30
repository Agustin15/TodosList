import classesStyle from "./Header.module.css";
import logo from "../../assets/img/logo.png";
import menuOpen from "../../assets/img/menuOpen.png";
import notificationIcon from "../../assets/img/notification.png";
import accountIcon from "../../assets/img/profile.png";
import iconMenuTask from "../../assets/img/tasksIcon.png";
import panelIcon from "../../assets/img/panel.png";
import calendarMenu from "../../assets/img/calendarMenu.png";
import logOutIcon from "../../assets/img/logOut.png";
import { useEffect } from "react";
import { useDataUser } from "../../context/userDataContext";
import { useMenu } from "../../context/MenuContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const Header = () => {
  const { user, getUserData, loadingUser, logoutSession } = useDataUser();
  const { headerClass, handleHideMenu } = useMenu();

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <header className={headerClass}>
        <nav>
          <div className={classesStyle.initHeader}>
            <div className={classesStyle.closeMenu}>
              <img onClick={handleHideMenu} src={menuOpen}></img>
            </div>
            <div className={classesStyle.logo}>
              <img src={logo}></img>

              <span>TodoList</span>
            </div>

            <ul>
              <li
                className={
                  location.href.indexOf("dashboard") > -1
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
                  location.href.indexOf("tasks") > -1
                    ? classesStyle.optionCurrent
                    : ""
                }
              >
                <a href="/tasks">
                  <img src={iconMenuTask}></img>
                  <span>Tasks</span>
                </a>
              </li>
              <li
                className={
                  location.href.indexOf("calendar") > -1
                    ? classesStyle.optionCurrent
                    : ""
                }
              >
                <a href="/calendar">
                  <img src={calendarMenu}></img>
                  <span>Calendar</span>
                </a>
              </li>
              <li>
                <a>
                  <img src={notificationIcon}></img>
                  <span>Notifications</span>
                </a>
              </li>
            </ul>
          </div>
          <div className={classesStyle.menuFoot}>
            <div className={classesStyle.containProfile}>
              <div className={classesStyle.iconProfile}>
                <img
                  onClick={() => (location.href = urlFront + "profile")}
                  src={accountIcon}
                ></img>
              </div>
              <span>{loadingUser ? "Loading..." : user.name}</span>
            </div>

            <div onClick={logoutSession} className={classesStyle.logOut}>
              <img src={logOutIcon}></img>
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
