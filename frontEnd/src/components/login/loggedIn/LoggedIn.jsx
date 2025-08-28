import styles from "./loggedIn.module.css";
import { useDataUser } from "../../../context/UserDataContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const LoggedIn = () => {
  const { logoutSession } = useDataUser();

  return (
    <div className={styles.containAlert}>
      <div className={styles.alertLoggedIn}>
        <div className={styles.title}>
          <h4>Confirm</h4>
        </div>
        <div className={styles.column}>
          <p>
            You already has a started session with other user, for login you
            must logout the account current.
          </p>

          <div className={styles.row}>
            <button onClick={() => logoutSession("logoutInLoginPage")}>
              Logout
            </button>
            <button onClick={() => (location.href = urlFront + "dashboard")}>
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
