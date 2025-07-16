import styles from "./Home.module.css";
import dashboardCapture from "../../assets/img/dashboardCapture.jpg";
import listTasksCapture from "../../assets/img/listTasksCapture.jpg";
import iconLogo from "../../assets/img/logo.png";
import homePageIcon from "../../assets/img/homePageIcon.png";
import listTaskCompletedCapture from "../../assets/img/listTaskCompletedCapture.jpg";
import calendarCapture from "../../assets/img/calendarCapture.jpg";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const Home = () => {
  return (
    <div className={styles.containHome}>
      <header>
        <div className={styles.titleHeader}>
          <h3>Todolist</h3>
          <img src={iconLogo}></img>
        </div>
        <a href={urlFront + "login"}>Login</a>
      </header>

      <div className={styles.rowOne}>
        <div className={styles.containSlider}>
          <div className={styles.contentSlider}>
            <ul className={styles.slider}>
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
            <li className={styles.indexCurrent}></li>
            <li className={styles.index}></li>
            <li className={styles.index}></li>
            <li className={styles.index}></li>
          </ul>
        </div>

        <div className={styles.welcome}>
          <div className={styles.rowWelcome}>
            <div className={styles.description}>
              <h3>Welcome to Todolist!</h3>
              <p>
                you will can be manage his tasks like never before!, you has the
                possibility of see the statistics of his week for has a better
                visualization of tasks completed and incomplete.
              </p>
              <p>
                If you are forgetful, don't worry, we will notify you,always and
                when you be subscribe!
              </p>

              <a href={urlFront + "signUp"}>
                <button>Sign up</button>
              </a>
            </div>

            <img src={homePageIcon}></img>
          </div>
        </div>
      </div>
    </div>
  );
};
