import classesStyle from "./AlertInputLogin.module.css";

const AlertInputLogin = ({ value, error }) => {
  return (
    <p
      className={
        value == "password"
          ? classesStyle.msjErrorPassword
          : classesStyle.msjError
      }
    >
      *{error}
    </p>
  );
};

export default AlertInputLogin;
