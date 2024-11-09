import classesStyle from "./AlertForm.module.css";

const AlertForm = ({ resultForm }) => {
  if (resultForm) {
    return (
      <div
        className={
          resultForm.result == "error"
            ? classesStyle.alertErrorForm
            : classesStyle.alertCorrectForm
        }
      >
        <img src={resultForm.icon}></img>
        <p>{resultForm.msj}</p>
      </div>
    );
  }
};

export default AlertForm;
