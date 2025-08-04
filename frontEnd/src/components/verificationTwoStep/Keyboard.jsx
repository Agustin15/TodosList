import styles from "./VerificationTwoStep.module.css";
import deleteIcon from "../../assets/img/deleteKeyboard.png";
import backIcon from "../../assets/img/backKeyboard.png";
import { useVerificationTwoStep } from "../../context/verificationTwoStep/VerificationTwoStepContext";

export const Keyboard = () => {
  const { handleKeyChar } = useVerificationTwoStep();
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
    <ul className={styles.keyboard}>
      {keyboard.map((row, indexRow) =>
        row.map((column, indexCol) => (
          <li
            key={indexCol}
            className={indexRow == 3 && indexCol == 1 ? styles.optionClean : ""}
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
  );
};
