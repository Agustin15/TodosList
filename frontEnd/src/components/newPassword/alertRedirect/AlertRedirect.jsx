import styles from "./AlertRedirect.module.css";
import iconTick from "../../../assets/img/checked.png";
import iconWarning from "../../../assets/img/warningInput.png";
import { useNewPassword } from "../../../context/NewPasswordContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const AlertRedirect = () => {
  const { invalidToken } = useNewPassword();

  return (
    <div className={styles.containAlert}>
      <div className={styles.rowAlert}>
        <img src={!invalidToken ? iconTick : iconWarning}></img>
        <p>
          {!invalidToken
            ? "Password updated succesfully"
            : "Reset password token expired,you back to generate other link please"}
        </p>
      </div>
      <button
        className={!invalidToken ? styles.btnGreen : styles.btnRed}
        onClick={() => (location.href = urlFront + "login")}
      >
        Redirect to Login
      </button>
    </div>
  );
};

export default AlertRedirect;
