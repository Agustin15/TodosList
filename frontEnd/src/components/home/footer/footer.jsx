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
          <a href="https://wa.me/598514200">
            <li>
              <img src={phoneContactIcon}></img>
            </li>
          </a>

          <a href="mailto:agus20m05@gmail.com">
            <li>
              <img src={emailContactIcon}></img>
            </li>
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/agustin-miranda-953634239/"
          >
            <li>
              <img src={linkedinContactIcon}></img>
            </li>
          </a>
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
