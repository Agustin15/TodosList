import { useState } from "react";
import styles from "./ResetPassword.module.css";
import iconLogo from "../../assets/img/logo.png";
import iconWarning from "../../assets/img/warningInput.png";
import gifLoading from "../../assets/img/gifLoading.gif";
import Alert from "../resetPassword/alert/Alert";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const ResetPassword = () => {
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMail, setErrorMail] = useState("");
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(false);

  const handleChange = async (event) => {
    setMail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let regexMail = /\S+@\S+\.\S+/;
    setError("");
    setErrorMail("");

    if (mail.length == 0 || !regexMail.test(mail)) {
      setErrorMail("Enter a valid email");
    } else {
      let idMail = await sendMail();
      if (idMail) {
        setAlert(true);
        setTimeout(() => {
          location.href = `${urlFront}login`;
        }, 5111);
      }
    }
  };

  const sendMail = async () => {
    setLoading(true);
    let data;
    try {
      const response = await fetch("api/resetPassword/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mail: mail })
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status == 404) {
          throw result.messageError;
        } else {
          throw "Oops, failed to send mail";
        }
      }
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
      return data;
    }
  };

  return (
    <div className={styles.containBody}>
      {alert && <Alert mail={mail}></Alert>}
      <div className={styles.title}>
        <img src={iconLogo}></img>
        <h2>TodoList</h2>
      </div>
      <div className={styles.containForm}>
        <form onSubmit={handleSubmit}>
          <h3>Reset password</h3>
          <div className={styles.containMail}>
            <label>Email</label>
            <input
              onChange={handleChange}
              name="mail"
              autoComplete="off"
              placeholder="Enter a email"
            ></input>
            {errorMail && (
              <div className={styles.alertInput}>
                <img src={iconWarning}></img>
                <p> {errorMail}</p>
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

export default ResetPassword;
