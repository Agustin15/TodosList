import styles from "./footer.module.css";
import phoneContactIcon from "../../../assets/img/phoneContact.png";
import emailContactIcon from "../../../assets/img/emailContact.png";
import linkedinContactIcon from "../../../assets/img/linkedinContact.png";
import iconHelp from "../../../assets/img/help.png";
export const Footer = ({ setOpenFormHelp }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.contact}>
        <span>You can contact us!</span>
        <ul>
          <li>
            <img src={phoneContactIcon}></img>
          </li>
          <li>
            <img src={emailContactIcon}></img>
          </li>
          <li>
            <img src={linkedinContactIcon}></img>
          </li>
        </ul>
      </div>

      <div className={styles.rowFooter}>
        <div className={styles.copyright}>
          <a href="https://github.com/Agustin15/">Created by Agustin Miranda</a>
        </div>
        <div className={styles.containHelp}>
          <button onClick={() => setOpenFormHelp(true)}>
            Help
            <img src={iconHelp}></img>
          </button>
        </div>
      </div>
    </div>
  );
};
