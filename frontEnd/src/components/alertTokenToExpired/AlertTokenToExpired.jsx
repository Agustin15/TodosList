import styles from "./AlertTokenToExpired.module.css";
import iconSession from "../../assets/img/session.png";
import iconOverTime from "../../assets/img/plus.png";
import { useRef } from "react";
import { useToken } from "../../context/TokenContext";

const AlertTokenToExpired = ({ setOpenAlertToken }) => {
  const secondsRef = useRef();
  const { fetchToRefreshToken, logout } = useToken();

  setTimeout(() => {
    let valueSecondsRef = secondsRef.current.textContent;
    setInterval(() => {
      if (valueSecondsRef > 0) {
        valueSecondsRef--;
        secondsRef.current.textContent = " " + valueSecondsRef;
      }
      if (valueSecondsRef == 0) {
        logout();
      }
    }, 1400);
  }, 3000);

  const handleExtendSession = () => {
    setOpenAlertToken(false);
    fetchToRefreshToken();
  };

  return (
    <div className={styles.bodyContainAlert}>
      <div className={styles.containAlert}>
        <div className={styles.bodyAlert}>
          <img src={iconSession}></img>
          <p>
            Your session will expire in <span ref={secondsRef}>{20}</span>
          </p>
        </div>
        <div className={styles.containButton}>
          <button onClick={handleExtendSession}>
            Extend session
            <img src={iconOverTime}></img>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertTokenToExpired;
