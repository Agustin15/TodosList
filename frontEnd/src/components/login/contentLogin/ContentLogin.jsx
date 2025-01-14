import classesStyle from "../contentLogin/ContentLogin.module.css";
import loginIcon from "../../../assets/img/Login.gif";
import hiddenEye from "../../../assets/img/hidden.png";
import WelcomeFormSignUp from "../../signUp/welcomeSignUp/WelcomeFormSignUp.jsx";
import AlertForm from "../../addTodoForm/alertForm/AlertForm.jsx";
import AlertInputLogin from "../../signUp/alertInputLogin/AlertInputLogin.jsx";
import Loader from "../../loader/Loader.jsx";
import { useFormUser } from "../../../context/FormUserContext";
import { useForm } from "../../../context/FormContext";
import { useEffect } from "react";
import { useLogin } from "../../../context/LoginContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const ContentLogin = () => {
  const {
    user,
    passwordIcon,
    passwordInput,
    handlePassword,
    handleSubmitSignIn,
    errorsInputsSignIn,
    cleanForm,
  } = useFormUser();

  const { resultForm } = useForm();
  const { fetchLogin, loading } = useLogin();

  useEffect(() => {
    if (user) {
      const resultSignIn = async () => {
        const login = await fetchLogin(user, "http://localhost:3000/login/");

        if (login.accessToken && login.refreshToken) {
          cleanForm();
          localStorage.setItem("token", login.accessToken);
          localStorage.setItem("email", user.email);
          location.href = `${urlFront}tasks`;
        }
      };

      resultSignIn();
    }
  }, [user]);

  return (
    <>
      <WelcomeFormSignUp
        paragraphWelcome={"Sign in to access his tasks!"}
        paragraphAccount={"Don't have an account?"}
        optionLink={"Sign up"}
        link={`${urlFront}signup`}
      ></WelcomeFormSignUp>
      <div className={classesStyle.form}>
        <div className={classesStyle.title}>
          <h3 className={classesStyle.titleResponsive}>Welcome to TodoList!</h3>
          <img src={loginIcon}></img>
          <h3>Enter your data for sign in</h3>
        </div>
        <form onSubmit={handleSubmitSignIn}>
          <div className={classesStyle.containUsername}>
            <label>Email</label>
            <input
              autoComplete="off"
              name="email"
              type="text"
              placeholder="Enter email"
            ></input>
            {errorsInputsSignIn["email"] && (
              <AlertInputLogin error={errorsInputsSignIn["email"]} />
            )}
          </div>
          <div className={classesStyle.containPassword}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              ref={passwordInput}
              autoComplete="off"
            ></input>
            <img
              ref={passwordIcon}
              onClick={handlePassword}
              src={hiddenEye}
            ></img>
            {errorsInputsSignIn["password"] && (
              <AlertInputLogin error={errorsInputsSignIn["password"]} />
            )}
          </div>
          <a
            className={classesStyle.forgotPassword}
            href={`${urlFront}resetPassword`}
          >
            forgot your password?
          </a>

          <div className={classesStyle.containSignIn}>
            <button type="submit">
              Log in
              <Loader isLoading={loading} color="white" size={6} />
            </button>
          </div>
          <div className={classesStyle.haveAccountResponsive}>
            <p>
              Don't have an account?
              <a href={`${urlFront}signup`}> Sign up</a>
            </p>
          </div>
          {resultForm && <AlertForm />}
        </form>
      </div>
    </>
  );
};

export default ContentLogin;
