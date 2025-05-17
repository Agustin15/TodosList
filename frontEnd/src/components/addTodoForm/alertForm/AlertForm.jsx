import {useRef } from "react";
import classesStyle from "./AlertForm.module.css";
import { useForm } from "../../../context/FormTaskContext";
const AlertForm = () => {
  const alert = useRef();
  const { resultForm } = useForm();

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

      <div className={classesStyle.info}>
        <span>{resultForm.result == "correct" ? "Succes!" : "Error!"}</span>
        <p>{resultForm.msj}</p>
      </div>
    </div>
  );
};

export default AlertForm;
