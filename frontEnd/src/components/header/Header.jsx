import classesStyle from "./Header.module.css";
import logo from "../../assets/img/logo.png";
import accountIcon from "../../assets/img/profile.png";
import panelIcon from "../../assets/img/panel.png";
import calendarMenu from "../../assets/img/calendarMenu.png";
import allTasksIcon from "../../assets/img/allTasksIcon.png";
import emailIcon from "../../assets/img/email.png";
import logOutIcon from "../../assets/img/logOut.png";
import { useEffect, useState } from "react";
import { useDataUser } from "../../context/userDataContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const Header = () => {
  const [openDetailsProfile, setOpenDetailsProfile] = useState(false);
  const { user, getUserData, loadingUser, logoutSession } = useDataUser();

  useEffect(() => {
    getUserData();
  }, []);

  const handleOpenDetailsProfile = () => {
    if (window.innerWidth <= 699) {
      location.href = urlFront + "profile";
    } else {
      if (openDetailsProfile) {
        setOpenDetailsProfile(false);
      } else {
        setOpenDetailsProfile(true);
      }
    }
  };

  return (
    <>
      <header className={classesStyle.header}>
        <nav>
          <div className={classesStyle.initHeader}>
            <div className={classesStyle.logo}>
              <img src={logo}></img>
              <span>TodoList</span>
            </div>
            <ul>
              <li>
                <img src={panelIcon}></img>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                <img src={allTasksIcon}></img>
                <a href="/tasks">Tasks</a>
              </li>
              <li>
                <img src={calendarMenu}></img>
                <a href="/calendar">Calendar</a>
              </li>
            </ul>
          </div>
          <div className={classesStyle.containProfile}>
            <img onClick={handleOpenDetailsProfile} src={accountIcon}></img>
            {/* <span>{user.nameUser}</span> */}
            <div
              className={
                openDetailsProfile
                  ? classesStyle.containDetailsProfileShow
                  : classesStyle.containDetailsProfileHidden
              }
            >
              <div className={classesStyle.dataProfile}>
                <div className={classesStyle.rowOne}>
                  <img src={accountIcon}></img>
                  <div className={classesStyle.columnOne}>
                    <span>
                      {loadingUser
                        ? "loading..."
                        : user.nameUser + " " + user.lastname}
                    </span>
                    <a href="/profile">View profile</a>
                  </div>
                </div>

                <div className={classesStyle.email}>
                  <img src={emailIcon}></img>
                  <span>{loadingUser ? "loading..." : user.email}</span>
                </div>
              </div>

              <div onClick={logoutSession} className={classesStyle.logOut}>
                <img src={logOutIcon}></img>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
