import styles from "./AlertRedirect.module.css";
import iconTick from "../../../assets/img/checked.png";

const AlertRedirect = () => {
  return (
    <div className={styles.containAlert}>
      <img src={iconTick}></img>
      <p>Password updated succesfully,will be redirected to login...</p>
    </div>
  );
};

export default AlertRedirect;
