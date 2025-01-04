import { useState } from "react";
import styles from "./NewPassword.module.css";
import iconHiddenEye from "../../assets/img/hidden.png";
import iconEye from "../../assets/img/eye.png";
import Loader from "../loader/Loader";
import AlertRedirect from "./alertRedirect/AlertRedirect";

const NewPassword = () => {
  const [errorsInputs, setErrorsInputs] = useState({
    newPassword: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  let token = urlParams.get("token");
  let mail = urlParams.get("mail");

  if (!token) {
    location.href = "http://localhost:5173/resetPassword";
  }

  const changePassword = async () => {
    let password = passwords.newPassword;
    let data;
    if (mail) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/resetPassword/" + mail,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${JSON.stringify(token)}`,
            },
            body: JSON.stringify({ password }),
          }
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
        if (error.indexOf("Authentication") > -1) {
          setError("*Token to reset password expired");
        } else {
          setError("*Failed to update password");
        }
      } finally {
        setLoading(false);
        if (data) {
          cleanForm();
          setAlert(true);
          setTimeout(() => {
            location.href = "http://localhost:5173/login";
          }, 4000);
        }
      }
    }
  };

  const cleanForm = () => {
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
  };

  const validationMsj = (key, value) => {
    const validationsMsjs = [
      {
        key: "newPassword",
        msj: "*Weak password (min 6 chars)",
        validation: value.length >= 6,
      },
      {
        key: "repeatPassword",
        msj: "*Complete field",
        validation: value.length > 0,
      },
    ];

    return validationsMsjs.find((validation) => validation.key == key);
  };

  const passwords = {};
  const handleSubmit = async (event) => {
    event.preventDefault();
    let error;
    let inputsErrors = { newPassword: "", repeatPassword: "" };
    setErrorsInputs(inputsErrors);
    setError("");

    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      let validationInput = validationMsj(key, value);

      if (!validationInput.validation) {
        inputsErrors[key] = validationInput.msj;

        error = true;
      } else {
        passwords[key] = value;
      }
    });

    if (!error) {
      if (passwords.newPassword.trim() != passwords.repeatPassword.trim()) {
        setError("*Passwords not match");
      } else {
        changePassword();
      }
    }
    setErrorsInputs(inputsErrors);
  };

  const handleViewHidePassword = (event) => {
    const iconEyePassword = event.target;
    let input = iconEyePassword.parentElement.querySelector("input");
    if (input.type == "password") {
      input.type = "text";
      iconEyePassword.src = iconEye;
    } else {
      input.type = "password";
      iconEyePassword.src = iconHiddenEye;
    }
  };

  return (
    <div className={styles.containBody}>
      {alert && <AlertRedirect />}
      <h2>TodoList</h2>
      <div className={styles.containForm}>
        <form onSubmit={handleSubmit}>
          <h3>Change password</h3>
          <div className={styles.containNewPassword}>
            <label>New password </label>
            <input
              autoComplete="off"
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
            ></input>
            <img onClick={handleViewHidePassword} src={iconHiddenEye}></img>
            {errorsInputs.newPassword && (
              <p className={styles.alertInput}>{errorsInputs.newPassword}</p>
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
            <img onClick={handleViewHidePassword} src={iconHiddenEye}></img>
            {errorsInputs.repeatPassword && (
              <p className={styles.alertInput}>{errorsInputs.repeatPassword}</p>
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

export default NewPassword;
