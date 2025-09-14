import styles from "./VerificationTwoStep.module.css";
import gifLoading from "../../assets/img/loadingForm.gif";
import loginIcon from "../../assets/img/Login.gif";
import infoIcon from "../../assets/img/info.png";
import logo from "../../assets/img/logo.png";
import { Keyboard } from "./Keyboard";
import WelcomeFormSignUp from "../signUp/welcomeSignUp/WelcomeFormSignUp";
import { useVerificationTwoStep } from "../../context/verificationTwoStep/VerificationTwoStepContext";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const VerificationTwoStep = () => {
  const {
    handleComprobateVerificationCode,
    fetchDecodeVerificationToken,
    decodeToken,
    refInput,
    fetchSendVerificationCode,
    loading
  } = useVerificationTwoStep();

  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(JSON.parse(searchParams.get("token")));
  const [sentAgain, setSentAgain] = useState(false);

  useEffect(() => {
    if (!token) location.href = urlFront + "login";
    fetchDecodeVerificationToken(token);
  }, []);

  const sendVerificationCodeAgain = async () => {
    let newVerificationToken = await fetchSendVerificationCode(decodeToken);

    if (newVerificationToken) {
      setToken(newVerificationToken);
      setSentAgain(true);
    }
  };

  return (
    <div className={styles.rowVerificationTwoStep}>
      <WelcomeFormSignUp
        paragraphWelcome={"Sign in to access his tasks!"}
        paragraphAccount={"Don't have an account?"}
        optionLink={"Sign up"}
        link={`${urlFront}signup`}
      ></WelcomeFormSignUp>
      <div className={styles.containVerificationTwoStep}>
        <div className={styles.titleResponsive}>
          <img src={logo}></img>
          <h3>Welcome to TodoList!</h3>
        </div>

        <div className={styles.title}>
          <img src={loginIcon}></img>
          <h3>
            Enter verification code sent you to{" "}
            <a>{decodeToken && decodeToken.email}</a>{" "}
          </h3>
        </div>
        <input
          inputMode="none"
          ref={refInput}
          placeholder="* * * * * *"
          maxLength={6}
          onKeyDown={(event) => event.preventDefault()}
        ></input>
        <Keyboard />

        <p>
          Do you not received the code?{" "}
          <a onClick={sendVerificationCodeAgain}>We are send again</a>
        </p>
        <div
          className={
            sentAgain
              ? styles.containAlertSentAgain
              : styles.containAlertSentAgainHidden
          }
        >
          <img src={infoIcon}></img>
          <span>Verification code sent again!</span>
        </div>

        <button
          type="button"
          onClick={() =>
            handleComprobateVerificationCode(refInput.current.value, token)
          }
          className={styles.btnVerify}
        >
          Verify
          {loading && <img src={gifLoading}></img>}
        </button>
      </div>
    </div>
  );
};
