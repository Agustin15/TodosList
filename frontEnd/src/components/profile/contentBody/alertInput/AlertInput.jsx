import styles from "./AlertInput.module.css";
import iconWarning from "../../../../assets/img/warningInput.png";

export const AlertInput = ({ msj }) => {
  return (
    <div className={styles.containAlertInput}>
      <img src={iconWarning}></img>
      <span>{msj}</span>
    </div>
  );
};
