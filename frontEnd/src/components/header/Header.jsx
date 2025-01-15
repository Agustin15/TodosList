import classesStyle from "./Header.module.css";
import iconLogo from "../../assets/img/iconLogo.png";
import btnImgPlus from "../../assets/img/plus.png";
import accountIcon from "../../assets/img/profile.png";
import logOutIcon from "../../assets/img/logOut.png";
import Modal from "../modal/Modal";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import AlertTokenToExpired from "../alertTokenToExpired/AlertTokenToExpired";
import { TaskProvider } from "../../context/TaskContext";
import { FormProvider } from "../../context/FormContext";
import { useEffect, useState } from "react";
import { useToken } from "../../context/TokenContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const Header = () => {
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openDetailsProfile, setOpenDetailsProfile] = useState(false);
  const [openAlertToken, setOpenAlertToken] = useState(false);
  const { logout, verifyToTokenExpired } = useToken();

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  if (!token) {
    logout();
  }

  useEffect(() => {
    setInterval(async () => {
      const resultVerifiyExpired = await verifyToTokenExpired();
      if (resultVerifiyExpired == "to expire") {
        setOpenAlertToken(true);
      }
    }, 9000);
  }, []);

  const handleOpenDetailsProfile = () => {
    if (openDetailsProfile) {
      setOpenDetailsProfile(false);
    } else {
      setOpenDetailsProfile(true);
    }
  };

  return (
    <>
      {openAlertToken && (
        <AlertTokenToExpired setOpenAlertToken={setOpenAlertToken} />
      )}
      <header className={classesStyle.header}>
        <nav>
          <div className={classesStyle.initHeader}>
            <img src={iconLogo}></img>
            <span>TodoList</span>
            <ul>
              <li>
                <button onClick={() => setOpenModalAdd(true)}>
                  Add new Task
                  <img src={btnImgPlus}></img>
                </button>
              </li>
            </ul>
          </div>
          <div className={classesStyle.containProfile}>
            <img onClick={handleOpenDetailsProfile} src={accountIcon}></img>
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
                  <span title={email}>{email}</span>
                </div>
                <button onClick={() => (location.href = `${urlFront}profile`)}>
                  Edit profile
                </button>
              </div>

              <div className={classesStyle.logOut}>
                <img src={logOutIcon}></img>
                <span onClick={logout}>Logout</span>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {openModalAdd && (
        <Modal>
          <TaskProvider>
            <FormProvider>
              <AddTodoForm setOpenModalAdd={setOpenModalAdd} />
            </FormProvider>
          </TaskProvider>
        </Modal>
      )}
    </>
  );
};

export default Header;
