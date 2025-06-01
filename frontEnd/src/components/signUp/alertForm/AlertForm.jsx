import { useRef } from "react";
import classesStyle from "./AlertForm.module.css";
import { useFormUser } from "../../../context/FormUserContext";
const AlertForm = () => {
  const alert = useRef();
  const { resultForm } = useFormUser();

  return (
    <div ref={alert} className={classesStyle.alertFormError}>
      <img src={resultForm.icon}></img>

      <div className={classesStyle.info}>
        <span>{"Error!"}</span>
        <p>{resultForm.msj}</p>
      </div>
    </div>
  );
};

export default AlertForm;
