import classesStyle from "../login/login.module.css";
import ContentLogin from "./contentLogin/ContentLogin";

const Login = () => {
  return (
    <div className={classesStyle.bodyPage}>
      <div className={classesStyle.containForm}>
        <ContentLogin></ContentLogin>
      </div>
    </div>
  );
};

export default Login;
