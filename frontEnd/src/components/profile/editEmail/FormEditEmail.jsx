import styles from "./FormEditEmail.module.css";
import iconEditMail from "../../../assets/img/editMail.png";
import iconPasswordHide from "../../../assets/img/hidden.png";
import iconWarningInput from "../../../assets/img/warningInput.png";
import loadingForm from "../../../assets/img/loadingForm.gif";
import { useFormEditEmail } from "../../../context/FormEditEmailContext";
import { useFormEditPassword } from "../../../context/FormEditPasswordContext";
import { useDataUser } from "../../../context/userDataContext";
import { useEffect } from "react";
import { AlertFormSwal } from "../../sweetAlert/sweetAlert.js";
import { useWindowSize } from "../../../context/WindowSizeContext.jsx";
import { GlassEffect } from "../../glassEffect/GlassEffect.jsx";

const FormEditEmail = ({ email, setModalEditEmail }) => {
  const {
    loading,
    values,
    setValues,
    setErrors,
    errors,
    handleSubmit,
    fetchUpdateEmail
  } = useFormEditEmail();

  const { setUser } = useDataUser();
  const { handlePassword } = useFormEditPassword();
  const { windowWidth } = useWindowSize();

  const handleClose = () => {
    setModalEditEmail(false);
    setErrors({
      newEmail: "",
      password: ""
    });
    setValues();
  };

  useEffect(() => {
    if (values) {
      const updateEmail = async () => {
        let userUpdated = await fetchUpdateEmail();
        if (userUpdated) {
          AlertFormSwal(
            "Email updated sucesfully!",
            "Success",
            "success",
            windowWidth
          );
          setUser(userUpdated);
        }
      };

      updateEmail();
    }
  }, [values]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.navBar}>
        <GlassEffect />
        <div className={styles.containBtnClose}>
          <button onClick={handleClose}>X</button>
        </div>
        <div className={styles.title}>
          <h4>Edit email</h4>
          <img src={iconEditMail}></img>
        </div>
      </div>

      <div className={styles.containInputs}>
        <div className={styles.containEmail}>
          <label>Current email</label>
          <input
            className={styles.inputEmail}
            name="email"
            defaultValue={email}
            readOnly
          ></input>
        </div>
        <div className={styles.containNewEmail}>
          <label>New email</label>
          <input
            className={styles.inputNewEmail}
            name="newEmail"
            type="email"
            autoComplete="off"
            placeholder="Enter new email"
          ></input>
          {errors.newEmail.length > 0 && (
            <div className={styles.alertErrorInput}>
              <img src={iconWarningInput}></img>
              <p>{errors.newEmail}</p>
            </div>
          )}
        </div>
        <div className={styles.containPassword}>
          <label>Password</label>
          <input
            className={styles.inputPassword}
            name="password"
            type="password"
            placeholder="Enter password"
            autoComplete="off"
          ></input>
          {errors.password.length > 0 && (
            <div className={styles.alertErrorInput}>
              <img src={iconWarningInput}></img>
              <p>{errors.password}</p>
            </div>
          )}
          <img
            className={styles.viewPassword}
            onClick={handlePassword}
            src={iconPasswordHide}
          ></img>
        </div>
      </div>
      <div className={styles.containButton}>
        <button type="submit">
          Update
          {loading && <img src={loadingForm}></img>}
          <GlassEffect />
        </button>
      </div>
    </form>
  );
};

export default FormEditEmail;
