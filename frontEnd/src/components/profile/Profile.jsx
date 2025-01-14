import styles from "./Profile.module.css";
import iconLogo from "../../assets/img/iconLogo.png";
import iconEditUser from "../../assets/img/editUser.png";
import iconBack from "../../assets/img/back.png";
import iconNoDataUser from "../../assets/img/noDataUser.png";
import { useEffect, useState } from "react";
import { useToken } from "../../context/TokenContext";
import AlertTokenToExpired from "../alertTokenToExpired/AlertTokenToExpired";
import FormEditEmail from "./editEmail/FormEditEmail";
import EditPassword from "./editPassword/EditPassword";
import Modal from "../modal/Modal";
import ContentBody from "./contentBody/ContentBody";
import Loader from "../loader/Loader";
const urlFront=import.meta.env.VITE_LOCALHOST_FRONT;

const Profile = () => {
  const { logout, verifyToTokenExpired } = useToken();
  const [loading, setLoading] = useState(false);
  const [openAlertToken, setOpenAlertToken] = useState(false);
  const [modalEditEmail, setModalEditEmail] = useState(false);
  const [modalEditPassword, setModalEditPassword] = useState(false);
  const [user, setUser] = useState();

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  if (!token) {
    logout();
  }

  useEffect(() => {
    setInterval(async () => {
      const resultVerifiyExpired = await verifyToTokenExpired();
      if (resultVerifiyExpired == "to expire") {
        setOpenAlertToken(true);
      }
    }, 6000);
  }, []);

  useEffect(() => {
    const dataUser = async () => {
      let userData = await getDataUser();
      setUser(userData);
    };

    dataUser();
  }, []);

  const getDataUser = async () => {
    let data;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/userData/" + email, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      }

      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        logout();
      }
    } finally {
      setLoading(false);
      return data;
    }
  };
  return (
    <>
      {openAlertToken && (
        <AlertTokenToExpired setOpenAlertToken={setOpenAlertToken} />
      )}
      <header className={styles.header}>
        <nav>
          <div className={styles.initHeader}>
            <img src={iconLogo}></img>
            <span>TodoList</span>
          </div>
          <div className={styles.title}>
            <h2>Edit profile</h2>
            <img src={iconEditUser}></img>
          </div>
          <div className={styles.back}>
            <img
              onClick={() => (location.href = `${urlFront}tasks`)}
              src={iconBack}
            ></img>
          </div>
        </nav>
      </header>

      <div className={styles.contentBody}>
        {!loading && !user && (
          <div className={styles.noData}>
            <img src={iconNoDataUser}></img>
            <span>No data</span>
          </div>
        )}

        {loading && (
          <div className={styles.contentLoading}>
            <span>Loading data</span>
            <Loader isLoading={true} color="gray" size={8}></Loader>
          </div>
        )}
        {user && (
          <ContentBody
            user={user}
            setModalEditEmail={setModalEditEmail}
            setModalEditPassword={setModalEditPassword}
          />
        )}
      </div>

      {modalEditEmail && (
        <Modal>
          <FormEditEmail
            setModalEditEmail={setModalEditEmail}
            email={email}
          ></FormEditEmail>
        </Modal>
      )}
      {modalEditPassword && (
        <Modal>
          <EditPassword
            setModalEditPassword={setModalEditPassword}
          ></EditPassword>
        </Modal>
      )}
    </>
  );
};

export default Profile;
