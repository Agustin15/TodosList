import classesStyle from "./AlertErrorInput.module.css";
import iconWarningInput from "../../../assets/img/WarningInput.png";

const AlertErrorInput = ({ input, error }) => {
  return (
    <div
      style={
        input == "description"
          ? { top: "8rem" }
          : input == "filesUploaded"
          ? { top: "9rem" }
          : { top: "4.7rem" }
      }
      id={classesStyle.alertError}
      className={
        error.length == 0
          ? classesStyle.alertErrorHide
          : classesStyle.alertErrorShow
      }
    >
      <img src={iconWarningInput}></img>
      <p>{error}</p>
    </div>
  );
};

export default AlertErrorInput;
