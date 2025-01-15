import styles from "./EditPassword.module.css";
import iconEditPassword from "../../../assets/img/editPassword.png";
import iconPasswordHide from "../../../assets/img/hidden.png";
import iconPasswordShow from "../../../assets/img/eye.png";
import errorIcon from "../../../assets/img/errorIcon.png";
import correctIcon from "../../../assets/img/correctIcon.png";
import { useEffect, useState } from "react";
import { useFormUser } from "../../../context/FormUserContext";
import { useForm } from "../../../context/FormContext";
import AlertForm from "../../addTodoForm/alertForm/AlertForm";
import Loader from "../../loader/Loader";

const EditPassword = ({ setModalEditPassword }) => {
  const { resultForm, setResultForm } = useForm();
  const [values, setValues] = useState();
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const mail = localStorage.getItem("email");

  const handleClose = () => {
    setModalEditPassword(false);
    setResultForm();
  };
  const handlePassword = (event) => {
    let icon = event.target;
    let input = icon.parentElement.querySelector("input");

    if (input.type == "password") {
      input.type = "text";
      icon.src = iconPasswordShow;
    } else {
      input.type = "password";
      icon.src = iconPasswordHide;
    }
  };

  const ErrorResultForm = (msj) => {
    setResultForm({
      icon: errorIcon,
      result: "error",
      msj: msj,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let error = false;
    let errorsInputs = {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    };
    const data = {};
    setErrors(errorsInputs);
    setResultForm();

    formData.forEach((value, key) => {
      if (value.length < 6) {
        error = true;
        errorsInputs[key] = "*Weak password (min 6 chars)";
      } else {
        data[key] = value;
      }
    });

    if (error) {
      ErrorResultForm("Please, complete correctly the fields");
      setErrors(errorsInputs);
    } else if (data.newPassword != data.repeatPassword) {
      ErrorResultForm("New password and repeat password not match");
    } else {
      setValues(data);
    }
  };

  useEffect(() => {
    if (values) {
      const updatePassword = async () => {
        let passwordUpdated = await fetchUpdatePassword();
        if (passwordUpdated) {
          setResultForm({
            icon: correctIcon,
            result: "correct",
            msj: "Password updated sucesfully!",
          });
        }
      };

      updatePassword();
    }
  }, [values]);

  const fetchUpdatePassword = async () => {
    let data;
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
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            password: values.newPassword,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw result.messageError;
      } else if (result) {
        data = response;
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        localStorage.setItem("tokenExpired", true);
        logout();
      } else {
        setResultForm({
          icon: errorIcon,
          result: "error",
          msj: error,
        });
      }
    } finally {
      setLoading(false);
      return data;
    }
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
          <img onClick={handlePassword} src={iconPasswordHide}></img>
          <p className={styles.error}>{errors.currentPassword}</p>
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
          <img onClick={handlePassword} src={iconPasswordHide}></img>
          <p className={styles.error}>{errors.newPassword}</p>
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
          <p className={styles.error}>{errors.repeatPassword}</p>
          <img onClick={handlePassword} src={iconPasswordHide}></img>
        </div>
      </div>

      <div className={styles.containButton}>
        <button type="submit">
          Update
          <Loader isLoading={loading} color="white" size={7} />
        </button>
      </div>

      {resultForm && <AlertForm />}
    </form>
  );
};

export default EditPassword;
