import styles from "./Title.module.css";
import iconOpenMenu from "../../assets/img/openMenu.png";
import { useMenu } from "../../context/MenuContext";
export const Title = ({ title, icon }) => {
  const { handleDisplayMenu } = useMenu();

  return (
    <div className={styles.title}>
      <div className={styles.openMenu}>
        <img onClick={handleDisplayMenu} src={iconOpenMenu}></img>
      </div>
      <img src={icon}></img>
      <h3>{title}</h3>
    </div>
  );
};
