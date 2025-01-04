import styles from "./Alert.module.css";
import iconTick from "../../../assets/img/checked.png";

const Msj = ({ mail }) => {
  return (
    <div className={styles.containMsj}>
      <img src={iconTick}></img>
      <p>
        We have sent an email to <a>{mail}</a> for restore password,please check
        it, will be redirected to login...
      </p>
    </div>
  );
};

export default Msj;
