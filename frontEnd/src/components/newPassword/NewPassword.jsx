import styles from "./NewPassword.module.css";
import iconHiddenEye from "../../assets/img/hidden.png";
import gifLoading from "../../assets/img/gifLoading.gif";
import iconLogo from "../../assets/img/logo.png";
import iconWarning from "../../assets/img/warningInput.png";
import AlertRedirect from "./alertRedirect/AlertRedirect";
import { useNewPassword } from "../../context/NewPasswordContext";
import { useEffect } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const NewPassword = () => {
  const {
    error,
    loading,
    alert,
    verifyTokenResetPassword,
    invalidToken,
    errorsInputs,
    handleSubmit,
    handleViewHidePassword
  } = useNewPassword();

  const urlParams = new URLSearchParams(window.location.search);
  let token = urlParams.get("token");

  if (!token) {
    location.href = `${urlFront}resetPassword`;
  }

  useEffect(() => {
    verifyTokenResetPassword(token);
  }, []);

  return (
    <div className={styles.containBody}>
      {alert && <AlertRedirect invalidToken={invalidToken} />}
      <div className={styles.title}>
        <img src={iconLogo}></img>
        <h2>TodoList</h2>
      </div>
      <div className={styles.containForm}>
        <form onSubmit={(event) => handleSubmit(event, token)}>
          <h3>Change password</h3>
          <div className={styles.containNewPassword}>
            <label>New password </label>
            <input
              autoComplete="off"
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
            ></input>
            <img
              className={styles.viewPassword}
              onClick={handleViewHidePassword}
              src={iconHiddenEye}
            ></img>
            {errorsInputs.newPassword && (
              <div className={styles.alertInput}>
                <img src={iconWarning}></img>
                <p>{errorsInputs.newPassword}</p>
              </div>
            )}
          </div>
          <div className={styles.containRepeatPassword}>
            <label>Repeat new password </label>
            <input
              autoComplete="off"
              type="password"
              name="repeatPassword"
              placeholder="Repeat your password"
            ></input>
            <img
              className={styles.viewPassword}
              onClick={handleViewHidePassword}
              src={iconHiddenEye}
            ></img>
            {errorsInputs.repeatPassword && (
              <div className={styles.alertInput}>
                <img src={iconWarning}></img>
                <p>{errorsInputs.repeatPassword}</p>
              </div>
            )}
          </div>
          <button>Send</button>
          {loading && (
            <div className={styles.loading}>
              <span>loading</span>
              <img src={gifLoading}></img>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <img src={iconWarning}></img>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
