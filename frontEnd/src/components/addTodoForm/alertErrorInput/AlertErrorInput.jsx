import classesStyle from "./AlertErrorInput.module.css";

const AlertErrorInput = ({ error }) => {
  return (
    <div
      id={classesStyle.alertError}
      className={
        error == "" ? classesStyle.alertErrorHide : classesStyle.alertErrorShow
      }
    >
      <div className={classesStyle.triangle}></div>
      <p>{error}</p>
    </div>
  );
};

export default AlertErrorInput;
