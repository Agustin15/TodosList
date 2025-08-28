import classesStyle from "../contentLogin/ContentLogin.module.css";
import loginIcon from "../../../assets/img/Login.gif";
import gifLoading from "../../../assets/img/loadingForm.gif";
import hiddenEye from "../../../assets/img/hidden.png";
import logo from "../../../assets/img/logo.png";
import WelcomeFormSignUp from "../../signUp/welcomeSignUp/WelcomeFormSignUp.jsx";
import AlertForm from "../../signUp/alertForm/AlertForm.jsx";
import AlertInputLogin from "../../signUp/alertInputLogin/AlertInputLogin.jsx";
import { useFormUser } from "../../../context/FormUserContext";
import { useEffect } from "react";
import { useLogin } from "../../../context/LoginContext";
import { useCookies } from "react-cookie";
import { LoggedIn } from "../loggedIn/LoggedIn.jsx";
import { UserDataProvider } from "../../../context/UserDataContext.jsx";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const ContentLogin = () => {
  const [cookies] = useCookies();
  const {
    user,
    passwordIcon,
    passwordInput,
    handlePassword,
    handleSubmitSignIn,
    errorsInputsSignIn,
    resultForm
  } = useFormUser();

  const { fetchLogin, loading } = useLogin();

  useEffect(() => {
    if (user) {
      const resultSignIn = async () => {
        await fetchLogin(user, `/api/login/`, "login");
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
        <div className={classesStyle.titleResponsive}>
          <img src={logo}></img>
          <h3>Welcome to TodoList!</h3>
        </div>
        <div className={classesStyle.title}>
          <img src={loginIcon}></img>
          <h3>Enter your data for sign in</h3>
        </div>
        {!cookies.loggedIn ? (
          <>
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
                  className={classesStyle.showPassword}
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
                Do you forgot your password?
              </a>

              <div className={classesStyle.containSignIn}>
                <button type="submit">
                  Log in
                  {loading && <img src={gifLoading}></img>}
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
          </>
        ) : (
          <UserDataProvider>
            <LoggedIn></LoggedIn>
          </UserDataProvider>
        )}
      </div>
    </>
  );
};

export default ContentLogin;
