import styles from "./VerificationTwoStep.module.css";
import gifLoading from "../../../assets/img/loadingForm.gif";
import loginIcon from "../../../assets/img/Login.gif";
import logo from "../../../assets/img/logo.png";
import deleteIcon from "../../../assets/img/deleteKeyboard.png";
import backIcon from "../../../assets/img/backKeyboard.png";
import { useVerificationTwoStep } from "../../../context/VerificationTwoStepContext";
import { useEffect } from "react";

export const VerificationTwoStep = () => {
  const {
    handleComprobateVerificationCode,
    handleKeyChar,
    refInput,
    fetchSendVerificationCode
  } = useVerificationTwoStep();

  useEffect(() => {
    fetchSendVerificationCode();
  }, []);

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
                {indexCol != 3 ? (
                  column.value
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

      <button
        type="button"
        onClick={() => handleComprobateVerificationCode(refInput.current.value)}
        className={styles.btnVerify}
      >
        Verify
      </button>
    </div>
  );
};
