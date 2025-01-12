import styles from "./ContentBody.module.css";
import iconPencil from "../../../assets/img/pencil.png";
import iconProfile from "../../../assets/img/profile.png";
import iconUserInfo from "../../../assets/img/infoUser.png";
import iconEditMail from "../../../assets/img/editMail.png";
import iconEditPassword from "../../../assets/img/editPassword.png";

const ContentBody = ({ user, setModalEditEmail, setModalEditPassword }) => {
  return (
    <>
      <div className={styles.title}>
        <h4>{`${user.name} ${user.lastname}`}</h4>
        <img src={iconProfile}></img>
      </div>

      <div className={styles.containDataUser}>
        <div className={styles.dataUser}>
          <div className={styles.head}>
            <span>User details</span>
            <img src={iconUserInfo}></img>
          </div>

          <ul>
            <li>
              <span>Name:</span>
              {user.name}
            </li>
            <li>
              <span>Lastname:</span>
              {user.lastname}
            </li>
            <li>
              <span>Email:</span>
              {user.email}
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.containOptions}>
        <div className={styles.editMailOption}>
          <div className={styles.containIcon}>
            <img src={iconEditMail}></img>
          </div>
          <div className={styles.footer}>
            <span onClick={() => setModalEditEmail(true)}>Edit email</span>
            <img src={iconPencil}></img>
          </div>
        </div>

        <div className={styles.editPasswordOption}>
          <div className={styles.containIcon}>
            <img src={iconEditPassword}></img>
          </div>
          <div className={styles.footer}>
            <span onClick={() => setModalEditPassword(true)}>
              Edit password
            </span>
            <img src={iconPencil}></img>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentBody;
