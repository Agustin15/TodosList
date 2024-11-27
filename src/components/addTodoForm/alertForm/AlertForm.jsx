import { useEffect, useRef } from "react";
import classesStyle from "./AlertForm.module.css";
import { useForm } from "../../../context/FormContext";
const AlertForm = () => {
  const alert = useRef();
  const { resultForm, setResultForm } = useForm();

  useEffect(() => {
    if (resultForm.result == "correct") {
      setTimeout(() => {
        alert.current.style.display = "none";
        setResultForm(null);
      }, 2000);
    }
  }, [resultForm]);

  return (
    <div
      ref={alert}
      className={
        resultForm.result == "correct"
          ? classesStyle.alertFormCorrect
          : classesStyle.alertFormError
      }
    >
      <img src={resultForm.icon}></img>
      <p>{resultForm.msj}</p>
    </div>
  );
};

export default AlertForm;
