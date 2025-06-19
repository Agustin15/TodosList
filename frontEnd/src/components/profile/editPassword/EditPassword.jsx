import styles from "./EditPassword.module.css";
import iconEditPassword from "../../../assets/img/editPassword.png";
import iconPasswordHide from "../../../assets/img/hidden.png";
import iconWarningInput from "../../../assets/img/warningInput.png";
import loadingForm from "../../../assets/img/loadingForm.gif";
import { useFormEditPassword } from "../../../context/FormEditPasswordContext";

const EditPassword = ({ setModalEditPassword }) => {
  const {
    handleSubmit,
    handlePassword,
    errors,
    loading,
    setErrors,
  } = useFormEditPassword();

  const handleClose = () => {
    setErrors({ currentPassword: "", newPassword: "", repeatPassword: "" });
    setModalEditPassword(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.navBar}>
        <button onClick={handleClose}>X</button>
      </div>
      <div className={styles.title}>
        <h4>Edit password</h4>
        <img src={iconEditPassword}></img>
      </div>

      <div className={styles.containInputs}>
        <div className={styles.containCurrentPassword}>
          <label>Current Password</label>
          <input
            className={styles.inputCurrentPassword}
            name="currentPassword"
            placeholder="Enter current password"
            type="password"
            autoComplete="off"
          ></input>
          <img
            className={styles.viewPassword}
            onClick={handlePassword}
            src={iconPasswordHide}
          ></img>

          {errors.currentPassword.length > 0 && (
            <div className={styles.alertErrorInput}>
              <img src={iconWarningInput}></img>
              <p>{errors.currentPassword}</p>
            </div>
          )}
        </div>
        <div className={styles.containNewPassword}>
          <label>New Password</label>
          <input
            className={styles.inputNewPassword}
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            autoComplete="off"
          ></input>
          <img
            className={styles.viewPassword}
            onClick={handlePassword}
            src={iconPasswordHide}
          ></img>
          {errors.newPassword.length > 0 && (
            <div className={styles.alertErrorInput}>
              <img src={iconWarningInput}></img>
              <p>{errors.newPassword}</p>
            </div>
          )}
        </div>
        <div className={styles.containRepeatPassword}>
          <label>Repeat Password</label>
          <input
            className={styles.inputRepeatPassword}
            name="repeatPassword"
            type="password"
            placeholder="Repeat password"
            autoComplete="off"
          ></input>
          <img
            className={styles.viewPassword}
            onClick={handlePassword}
            src={iconPasswordHide}
          ></img>

          {errors.repeatPassword.length > 0 && (
            <div className={styles.alertErrorInput}>
              <img src={iconWarningInput}></img>
              <p>{errors.repeatPassword}</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.containButton}>
        <button type="submit">
          Update
          {loading && <img src={loadingForm}></img>}
        </button>
      </div>
    </form>
  );
};

export default EditPassword;
