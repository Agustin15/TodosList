import classesStyle from "./AlertForm.module.css";

const AlertForm = ({ result }) => {
  return (
    <div
      className={
        result.state != "Error"
          ? classesStyle.alertFormCorrect
          : classesStyle.alertFormError
      }
    >
      <img src={result.icon}></img>

      <div className={classesStyle.info}>
        <span>{result.state != "Error" ? "Succes!" : "Error!"}</span>
        <p>{result.msj}</p>
      </div>
    </div>
  );
};

export default AlertForm;
