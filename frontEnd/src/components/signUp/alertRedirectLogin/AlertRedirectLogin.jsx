import iconNice from "../../../assets/img/checked.png";
import styles from "./AlertRedirectLogin.module.css";

export const AlertRedirectLogin = () => {
  return (
    <div className={styles.containAlertRedirect}>
      <div className={styles.alertRedirectLogin}>
        <img src={iconNice}></img>
        <p>Sign up succesfully, redirect to login...</p>
      </div>
    </div>
  );
};
