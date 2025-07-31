import styles from "./VerificationTwoStep.module.css";
import gifLoading from "../../../assets/img/loadingForm.gif";
import loginIcon from "../../../assets/img/Login.gif";
import infoIcon from "../../../assets/img/info.png";
import logo from "../../../assets/img/logo.png";
import deleteIcon from "../../../assets/img/deleteKeyboard.png";
import backIcon from "../../../assets/img/backKeyboard.png";
import { useVerificationTwoStep } from "../../../context/verificationTwoStep/VerificationTwoStepContext";
import { useEffect } from "react";
import { useState } from "react";

export const VerificationTwoStep = () => {
  const {
    handleComprobateVerificationCode,
    handleKeyChar,
    refInput,
    fetchSendVerificationCode,
    loading
  } = useVerificationTwoStep();

  const [sentAgain, setSentAgain] = useState(false);

  // useEffect(() => {
  //   fetchSendVerificationCode();
  // }, []);

  const sendVerificationCodeAgain = async () => {
    await fetchSendVerificationCode();
    setSentAgain(true);
  };

  const keyboard = [
    [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: "delete", img: deleteIcon }
    ],
    [
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: "back", img: backIcon }
    ],
    [
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: "next", img: backIcon }
    ],
    [{ value: 9 }, { value: "clean" }]
  ];

  return (
    <div className={styles.containVerificationTwoStep}>
      <div className={styles.titleResponsive}>
        <img src={logo}></img>
        <h3>Welcome to TodoList!</h3>
      </div>

      <div className={styles.title}>
        <img src={loginIcon}></img>
        <h3>Enter verification code sent you </h3>
      </div>
      <input
        ref={refInput}
        type="text"
        placeholder="* * * * * *"
        maxLength={6}
        onKeyDown={(event) => event.preventDefault()}
      ></input>

      <ul className={styles.keyboard}>
        {keyboard.map((row, indexRow) =>
          row.map((column, indexCol) => (
            <li
              key={indexCol}
              className={
                indexRow == 3 && indexCol == 1 ? styles.optionClean : ""
              }
            >
              <button onClick={(event) => handleKeyChar(event, column)}>
                <div className={styles.glassEffect}></div>
                {indexCol != 3 ? (
                  <span>{column.value}</span>
                ) : (
                  <img
                    className={
                      indexRow == 2 && indexCol == 3 ? styles.iconNext : ""
                    }
                    src={column.img}
                  ></img>
                )}
              </button>
            </li>
          ))
        )}
      </ul>

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
        onClick={() => handleComprobateVerificationCode(refInput.current.value)}
        className={styles.btnVerify}
      >
        Verify
        {loading && <img src={gifLoading}></img>}
      </button>
    </div>
  );
};
