import { useState } from "react";
import styles from "./ResetPassword.module.css";
import Loader from "../loader/Loader";
import Alert from "../resetPassword/alert/Alert";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const urlBack = import.meta.env.VITE_LOCALHOST_BACK;

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
      setErrorMail("*Enter a valid email");
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
    let data, userNotFound;
    try {
      const response = await fetch(`${urlBack}resetPassword/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail: mail }),
      });

      const result = await response.json();
      if (!response.ok) {
        userNotFound = true;
        throw result.messageError;
      }

      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      if (userNotFound) {
        setError("*User not recognized");
        return;
      }
      if (!data) {
        setError("*Oops, failed to send mail");
      }
      return data;
    }
  };

  return (
    <div className={styles.containBody}>
      {alert && <Alert mail={mail}></Alert>}
      <h2>TodoList</h2>
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
            {errorMail && <p className={styles.alertInput}> {errorMail}</p>}
          </div>

          <button>Send</button>
          {loading && (
            <div className={styles.loading}>
              <span>Loading</span>
              <Loader isLoading={loading} color="gray" size={7} />
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
