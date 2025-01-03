import { useState } from "react";
import styles from "./ResetPassword.module.css";
import Loader from "../loader/Loader";
import Alert from "../resetPassword/alert/Alert";

const ResetPassword = () => {
  const [inputs, setInputs] = useState({ username: "", mail: "" });
  const [errorsInputs, setErrorsInputs] = useState({ username: "", mail: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let regexMail = /\S+@\S+\.\S+/;

    if (inputs.mail.trim().length == 0 || !regexMail.test(inputs.mail)) {
      setErrorsInputs({ ...errorsInputs, ["mail"]: "Enter a valid email" });
    } else if (inputs.username.length == 0) {
      setErrorsInputs({
        ...errorsInputs,
        ["username"]: "Enter a valid username",
      });
    } else {
      let resultUser = await verifyUser();
      if (resultUser) {
        let mailResult = await sendMail();
        if (mailResult) {
          setAlert(true);
        }
      }
    }
  };

  const sendMail = async () => {
    setLoading(true);
    let data;
    try {
      const response = await fetch("http://localhost:3000/mail/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail: inputs.mail, username: inputs.username }),
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
    } finally {
      setLoading(false);
      if (!data) {
        setError("*Oops, failed to send mail");
      }
      return data;
    }
  };

  const verifyUser = async () => {
    setLoading(true);
    let data;
    try {
      const response = await fetch(
        "http://localhost:3000/login/" + inputs.username
      );

      const result = await response.json();
      if (!response.ok) {
        throw result.messageError;
      }

      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      if (!data) {
        setError("*User not recognized");
      }
      return data;
    }
  };
  return (
    <div className={styles.containBody}>
      {alert && <Alert mail={inputs.mail}></Alert>}
      <h2>TodoList</h2>
      <div className={styles.containForm}>
        <form onSubmit={handleSubmit}>
          <h3>Reset password</h3>
          <div className={styles.containMail}>
            <label>Email</label>
            <input
              name="mail"
              onChange={handleChange}
              placeholder="Enter a email"
            ></input>
            {errorsInputs.mail && (
              <p className={styles.alertInput}>*Enter valid email</p>
            )}
          </div>
          <div className={styles.containMail}>
            <label>Username</label>
            <input
              name="username"
              onChange={handleChange}
              placeholder="Enter your username"
            ></input>
            {errorsInputs.username && (
              <p className={styles.alertInput}>*Enter valid username</p>
            )}
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
