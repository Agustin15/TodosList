import styles from "./FormEditEmail.module.css";
import iconEditMail from "../../../assets/img/editMail.png";
import iconPasswordHide from "../../../assets/img/hidden.png";
import errorIcon from "../../../assets/img/errorIcon.png";
import correctIcon from "../../../assets/img/correctIcon.png";
import { useEffect, useState } from "react";
import { useFormUser } from "../../../context/FormUserContext";
import { useForm } from "../../../context/FormContext";
import { useTasks } from "../../../context/TaskContext";
import AlertForm from "../../addTodoForm/alertForm/AlertForm";
import Loader from "../../loader/Loader";
const urlBack = import.meta.env.VITE_LOCALHOST_BACK;

const FormEditEmail = ({ email, setModalEditEmail }) => {
  const { handlePassword, passwordIcon, passwordInput } = useFormUser();
  const { resultForm, setResultForm } = useForm();
  const [values, setValues] = useState();
  const [errors, setErrors] = useState({
    newEmail: "",
    password: ""
  });

  const { setOpenAlertToken } = useTasks();
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleClose = () => {
    setModalEditEmail(false);
    setResultForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let error = false;
    let errorsInputs = {
      email: "",
      password: ""
    };
    const data = {};
    let regexMail = /\S+@\S+\.\S+/;

    setErrors(errorsInputs);
    setResultForm();

    formData.forEach((value, key) => {
      if (key == "password" && value.length < 6) {
        error = true;
        errorsInputs[key] = "*Weak password (min 6 chars)";
      }
      if ((key == "email" || key == "newEmail") && !regexMail.test(value)) {
        error = true;
        errorsInputs[key] = "*Enter a valid email";
      } else {
        data[key] = value;
      }
    });

    if (error) {
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: "Please, complete correctly the fields"
      });
      setErrors(errorsInputs);
    } else {
      setValues(data);
    }
  };

  useEffect(() => {
    if (values) {
      const updateEmail = async () => {
        let newToken = await fetchUpdateEmail();
        if (newToken) {
          setResultForm({
            icon: correctIcon,
            result: "correct",
            msj: "Email updated sucesfully!"
          });
          localStorage.setItem("email", values.newEmail);
          localStorage.setItem("token", newToken);
        }
      };

      updateEmail();
    }
  }, [values]);

  const fetchUpdateEmail = async () => {
    let data;
    setLoading(true);
    try {
      const response = await fetch(`${urlBack}userData/` + values.email, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
        },
        body: JSON.stringify({
          newEmail: values.newEmail,
          password: values.password
        })
      });

      const newToken = await response.json();
      if (!response.ok) {
        throw newToken.messageError;
      } else if (newToken) {
        data = newToken;
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authenticacion") > -1) {
        setOpenAlertToken(true);
      }
      setResultForm({
        icon: errorIcon,
        result: "error",
        msj: error
      });
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
        <h4>Edit email</h4>
        <img src={iconEditMail}></img>
      </div>

      <div className={styles.containInputs}>
        <div className={styles.containEmail}>
          <label>Current email</label>
          <input
            className={styles.inputEmail}
            name="email"
            value={email}
            readOnly
          ></input>
        </div>
        <div className={styles.containNewEmail}>
          <label>New email</label>
          <input
            className={styles.inputNewEmail}
            name="newEmail"
            type="email"
            placeholder="Enter new email"
          ></input>
          <p className={styles.error}>{errors.newEmail}</p>
        </div>
        <div className={styles.containPassword}>
          <label>Password</label>
          <input
            ref={passwordInput}
            className={styles.inputPassword}
            name="password"
            type="password"
            placeholder="Enter password"
            autoComplete="off"
          ></input>
          <p className={styles.error}>{errors.password}</p>
          <img
            onClick={handlePassword}
            ref={passwordIcon}
            src={iconPasswordHide}
          ></img>
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

export default FormEditEmail;
