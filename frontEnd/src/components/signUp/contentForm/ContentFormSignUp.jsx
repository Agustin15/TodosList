import classesStyle from "../contentForm/contentForm.module.css";
import iconSignUp from "../../../assets/img/signUpIcon.gif";
import logo from "../../../assets/img/logo.png";
import { useFormUser } from "../../../context/FormUserContext";
import { useEffect, useState } from "react";
import { useLogin } from "../../../context/LoginContext";
import { AlertRedirectLogin } from "../alertRedirectLogin/AlertRedirectLogin";
import WelcomeFormSignUp from "../welcomeSignUp/WelcomeFormSignUp";
import { Form } from "./Form";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const ContentFormSignUp = () => {
  const { user, cleanForm } = useFormUser();
  const { fetchLogin } = useLogin();
  const [openAlertSuccesfully, setOpenAlertSuccesfully] = useState(false);

  useEffect(() => {
    if (user) {
      const resultSignUp = async () => {
        const result = await fetchLogin(user, `api/signup/`, "signup");
        if (result) {
          cleanForm();
          redirect();
        }
      };

      resultSignUp();
    }
  }, [user]);

  const redirect = () => {
    setOpenAlertSuccesfully(true);
    setTimeout(function () {
      location.href = urlFront + "/login";
    }, 3000);
  };

  return (
    <>
      <WelcomeFormSignUp
        paragraphWelcome={"Sign up to organize and not forget your tasks!"}
        paragraphAccount={"Do you already have a account?"}
        optionLink={"Login"}
        link={`${urlFront}login`}
      ></WelcomeFormSignUp>
      <div className={classesStyle.form}>
        {openAlertSuccesfully && <AlertRedirectLogin />}
        <div className={classesStyle.title}>
          <img src={iconSignUp}></img>
          <h3>Enter your data for sign up</h3>
        </div>
        <div className={classesStyle.titleResponsive}>
          <h3>Welcome to TodoList!</h3>
          <img src={logo}></img>
        </div>
        <Form></Form>
      </div>
    </>
  );
};

export default ContentFormSignUp;
