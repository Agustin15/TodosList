import styles from "../alertNotToken/AlertNotToken.module.css";
import iconErrorAuth from "../../assets/img/authentication.png";
import { useRef } from "react";

const AlertNotToken = () => {
  const secondsRef = useRef();
  setTimeout(() => {
    let valueSecondsRef = secondsRef.current.textContent;
    setInterval(() => {
      if (valueSecondsRef > 0) {
        valueSecondsRef--;
        secondsRef.current.textContent = " " + valueSecondsRef;
      }
      if (valueSecondsRef == 0) {
        closeAccount();
      }
    }, 1400);
  }, 3000);

  const closeAccount = () => {
    localStorage.setItem("username", null);
    location.href = "http://localhost:5173/login";
  };

  return (
    <div className={styles.bodyContainAlert}>
      <div className={styles.containAlert}>
        <div className={styles.bodyAlert}>
          <img src={iconErrorAuth}></img>
          <p>
            Authentication failed,you will be redirected to login in
            <span ref={secondsRef}> {3}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertNotToken;
