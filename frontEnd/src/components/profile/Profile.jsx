import styles from "./Profile.module.css";
import iconNoDataUser from "../../assets/img/iconNotUser.jpg";
import iconUserAvatar from "../../assets/img/userAvatar.png";
import iconHome from "../../assets/img/home.png";
import gifLoading from "../../assets/img/gifLoading.gif";
import FormEditEmail from "./editEmail/FormEditEmail";
import EditPassword from "./editPassword/EditPassword";
import Modal from "../modal/Modal";
import ContentBody from "./contentBody/ContentBody";
import { useEffect, useState } from "react";
import { useDataUser } from "../../context/userDataContext";
import { FormEditEmailProvider } from "../../context/FormEditEmailContext";
import { FormEditPasswordProvider } from "../../context/FormEditPasswordContext";
import { VerificationTwoStepProvider } from "../../context/VerificationTwoStepContext";

const Profile = () => {
  const [modalEditEmail, setModalEditEmail] = useState(false);
  const [modalEditPassword, setModalEditPassword] = useState(false);
  const { user, setValues, loadingUser, getUserData } = useDataUser();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setValues({ name: user.name, lastname: user.lastname });
  }, [user]);

  return (
    <>
      <div className={styles.header}>
        <li>
          <a href="/dashboard">
            <div>
              <img src={iconHome}></img>
              <span>Home</span>
            </div>
          </a>
        </li>

        <h3>
          Edit Profile
          <img src={iconUserAvatar}></img>
        </h3>
      </div>

      {!loadingUser && !user && (
        <div className={styles.noData}>
          <img src={iconNoDataUser}></img>
          <span>Not user data</span>
        </div>
      )}

      {loadingUser && (
        <div className={styles.contentLoading}>
          <img src={gifLoading}></img>
          <span>loading user</span>
        </div>
      )}

      {user && (
        <>
          <div className={styles.contentBody}>
            <VerificationTwoStepProvider>
              <ContentBody
                user={user}
                setModalEditEmail={setModalEditEmail}
                setModalEditPassword={setModalEditPassword}
              />
            </VerificationTwoStepProvider>
          </div>
          <br></br>
        </>
      )}

      {modalEditEmail && (
        <Modal>
          <FormEditEmailProvider>
            <FormEditPasswordProvider>
              <FormEditEmail
                email={user.email}
                setModalEditEmail={setModalEditEmail}
              ></FormEditEmail>
            </FormEditPasswordProvider>
          </FormEditEmailProvider>
        </Modal>
      )}
      {modalEditPassword && (
        <Modal>
          <FormEditPasswordProvider>
            <EditPassword
              setModalEditPassword={setModalEditPassword}
            ></EditPassword>
          </FormEditPasswordProvider>
        </Modal>
      )}
    </>
  );
};

export default Profile;
