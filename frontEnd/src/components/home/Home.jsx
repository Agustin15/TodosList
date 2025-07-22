import styles from "./Home.module.css";
import dashboardCapture from "../../assets/img/dashboardCapture.jpg";
import listTasksCapture from "../../assets/img/listTasksCapture.jpg";
import iconLogo from "../../assets/img/logo.png";
import iconHelp from "../../assets/img/help.png";
import homePageIcon from "../../assets/img/homePageIcon.png";
import iconUserAvatar from "../../assets/img/userAvatar.png";
import listTaskCompletedCapture from "../../assets/img/listTaskCompletedCapture.jpg";
import calendarCapture from "../../assets/img/calendarCapture.jpg";
import { useEffect, useRef, useState } from "react";
import { FormHelp } from "./formHelp/FormHelp";
import { FormHelpProvider } from "../../context/FormHelpContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const Home = () => {
  const ulRef = useRef();
  const [arrayIndexs] = useState([0, 1, 2, 3]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openFormHelp, setOpenFormHelp] = useState(false);

  useEffect(() => {
    sliderPagination();
  }, [currentIndex]);

  const sliderPagination = () => {
    setTimeout(() => {
      if (currentIndex == arrayIndexs.length - 1) {
        setTimeout(() => setCurrentIndex(0), 300);
      } else setCurrentIndex(currentIndex + 1);
    }, 4900);
  };

  return (
    <div className={styles.containHome}>
      <header>
        <div className={styles.titleHeader}>
          <h3>Todolist</h3>
          <img src={iconLogo}></img>
        </div>
        <a href={urlFront + "login"}>
          <img src={iconUserAvatar}></img>
          Login
        </a>
      </header>

      <div className={styles.rowOne}>
        <div className={styles.containSlider}>
          <div className={styles.contentSlider}>
            <ul ref={ulRef} className={styles.slider}>
              <li>
                <img src={dashboardCapture}></img>
              </li>
              <li>
                <img src={listTasksCapture}></img>
              </li>
              <li>
                <img src={listTaskCompletedCapture}></img>
              </li>
              <li>
                <img src={calendarCapture}></img>
              </li>
            </ul>
          </div>
          <ul className={styles.pagination}>
            {arrayIndexs.map((index) => (
              <li
                key={index}
                className={
                  index == currentIndex ? styles.indexCurrent : styles.index
                }
              ></li>
            ))}
          </ul>
        </div>

        <div className={styles.welcome}>
          <div className={styles.rowWelcome}>
            <div className={styles.description}>
              <h3>Welcome to Todolist!</h3>
              <p>
                you will can be manage his tasks like never before!, you has the
                possibility of see the statistics of your week for has a better
                visualization of tasks completed and incomplete.
              </p>
              <p>
                If you are forgetful, don't worry, we will notify you,always and
                when you be subscribe!
              </p>

              <div className={styles.containBtn}>
                <a href={urlFront + "signUp"}>
                  <button>Sign up</button>
                </a>
              </div>
            </div>

            <div className={styles.containImage}>
              <img src={homePageIcon}></img>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.containHelp}>
        <FormHelpProvider>
          <FormHelp
            openFormHelp={openFormHelp}
            setOpenFormHelp={setOpenFormHelp}
          />
        </FormHelpProvider>
        <button onClick={() => setOpenFormHelp(true)}>
          Help
          <img src={iconHelp}></img>
        </button>
      </div>
    </div>
  );
};
