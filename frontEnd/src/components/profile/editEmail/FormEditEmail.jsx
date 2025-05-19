import styles from "./FormEditEmail.module.css";
import iconEditMail from "../../../assets/img/editMail.png";
import iconPasswordHide from "../../../assets/img/hidden.png";
import iconWarningInput from "../../../assets/img/warningInput.png";
import correctIcon from "../../../assets/img/correctIcon.png";
import loadingForm from "../../../assets/img/loadingForm.gif";
import AlertForm from "../contentBody/alertForm/AlertForm";
import { useFormEditEmail } from "../../../context/FormEditEmailContext";
import { useFormEditPassword } from "../../../context/FormEditPasswordContext";
import { useDataUser } from "../../../context/userDataContext";
import { useEffect } from "react";

const FormEditEmail = ({ email, setModalEditEmail }) => {
  const {
    loading,
    setResultForm,
    resultForm,
    values,
    setValues,
    setErrors,
    errors,
    handleSubmit,
    fetchUpdateEmail
  } = useFormEditEmail();

  const { setUser } = useDataUser();
  const { handlePassword } = useFormEditPassword();

  const handleClose = () => {
    setModalEditEmail(false);
    setResultForm();
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
          setResultForm({
            icon: correctIcon,
            state: "Correct",
            msj: "Email updated sucesfully!"
          });

          setUser(userUpdated);
        }
      };

      updateEmail();
    }
  }, [values]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.navBar}>
        <button onClick={handleClose}>X</button>
      </div>
      <div className={styles.title}>
        <h4>Edit email</h4>
        <img src={iconEditMail}></img>
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
        </button>
      </div>

      {resultForm && <AlertForm result={resultForm} />}
    </form>
  );
};

export default FormEditEmail;
