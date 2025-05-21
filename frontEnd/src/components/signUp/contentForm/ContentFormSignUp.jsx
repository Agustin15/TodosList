import classesStyle from "../contentForm/contentForm.module.css";
import iconSignUp from "../../../assets/img/signUpIcon.gif";
import hiddenEye from "../../../assets/img/hidden.png";
import correctIcon from "../../../assets/img/correctIcon.png";
import { useFormUser } from "../../../context/FormUserContext";
import { useForm } from "../../../context/FormTaskContext";
import { useEffect } from "react";
import { useLogin } from "../../../context/LoginContext";
import AlertForm from "../../addTodoForm/alertForm/AlertForm";
import AlertInputLogin from "../alertInputLogin/AlertInputLogin";
import WelcomeFormSignUp from "../welcomeSignUp/WelcomeFormSignUp";
import Loader from "../../loader/Loader";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const urlBack = import.meta.env.VITE_LOCALHOST_BACK;

const ContentFormSignUp = () => {
  const {
    user,
    passwordIcon,
    passwordInput,
    handlePassword,
    handleSubmitSignUp,
    errorsInputsSignUp,
    cleanForm
  } = useFormUser();
  const { resultForm, setResultForm } = useForm();
  const { fetchLogin, loading } = useLogin();

  useEffect(() => {
    if (user) {
      const resultSignUp = async () => {
        const result = await fetchLogin(user, `api/signup/`);
        if (result) {
          cleanForm();
          setResultForm({
            icon: correctIcon,
            result: "correct",
            msj: "User registered successfully"
          });
        }
      };

      resultSignUp();
    }
  }, [user]);

  return (
    <>
      <WelcomeFormSignUp
        paragraphWelcome={"Sign up to organize and not forget your tasks!"}
        paragraphAccount={"Already have a account?"}
        optionLink={"Login"}
        link={`${urlFront}login`}
      ></WelcomeFormSignUp>
      <div className={classesStyle.form}>
        <div className={classesStyle.title}>
          <h3 className={classesStyle.titleResponsive}>Welcome to TodoList!</h3>
          <img src={iconSignUp}></img>
          <h3>Enter your data for sign up</h3>
        </div>
        <form onSubmit={handleSubmitSignUp}>
          <div className={classesStyle.rowFormOne}>
            <div className={classesStyle.containName}>
              <label>Name</label>
              <input
                autoComplete="off"
                type="text"
                name="name"
                placeholder="Enter name"
              ></input>
              {errorsInputsSignUp["name"] && (
                <AlertInputLogin error={errorsInputsSignUp["name"]} />
              )}
            </div>

            <div className={classesStyle.containLastName}>
              <label>Lastname</label>
              <input
                autoComplete="off"
                name="lastname"
                type="text"
                placeholder="Enter lastname"
              ></input>
              {errorsInputsSignUp["lastname"] && (
                <AlertInputLogin error={errorsInputsSignUp["lastname"]} />
              )}
            </div>
          </div>

          <div className={classesStyle.rowFormTwo}>
            <div className={classesStyle.containUsername}>
              <label>Email</label>
              <input
                autoComplete="off"
                name="email"
                type="text"
                placeholder="Enter email"
              ></input>
              {errorsInputsSignUp["email"] && (
                <AlertInputLogin error={errorsInputsSignUp["email"]} />
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
              {errorsInputsSignUp["password"] && (
                <AlertInputLogin
                  value={"password"}
                  error={errorsInputsSignUp["password"]}
                />
              )}
            </div>
          </div>

          <div className={classesStyle.containSignUp}>
            <button type="submit">
              Sign up
              <Loader isLoading={loading} color="white" size={6} />
            </button>
          </div>
          <div className={classesStyle.haveAccountResponsive}>
            <p>
              Already have a account? <a href={`${urlFront}login`}>Login</a>
            </p>
          </div>

          {resultForm && <AlertForm />}
        </form>
      </div>
    </>
  );
};

export default ContentFormSignUp;
