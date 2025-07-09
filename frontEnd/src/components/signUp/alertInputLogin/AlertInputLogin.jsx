import classesStyle from "./AlertInputLogin.module.css";
import iconError from "../../../assets/img/warningInput.png";
const AlertInputLogin = ({ value, error }) => {
  return (
    <div
      className={
        value == "password"
          ? classesStyle.msjErrorPassword
          : classesStyle.msjError
      }
    >
      <img src={iconError}></img>
      
      <p>{error}</p>
    </div>
  );
};

export default AlertInputLogin;
