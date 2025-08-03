import styles from "./NotFound.module.css";
import error404Icon from "../../assets/img/error404.png";

export const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <img src={error404Icon}></img>
      <h3>Oops page not found</h3>
    </div>
  );
};
