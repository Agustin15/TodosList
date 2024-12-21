import classesStyle from "./AlertInputLogin.module.css";

const AlertInputLogin = ({ error }) => {
  return <p className={classesStyle.msjError}>*{error}</p>;
};

export default AlertInputLogin;
