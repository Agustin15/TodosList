import { useEffect, useRef } from "react";
import styles from "./ItemDetails.module.css";
import done from "../../../assets/img/correctIcon.png";
import cancel from "../../../assets/img/cancel.png";

const ItemDetails = ({ task, handleChangeState }) => {
  const buttonState = useRef();

  const changeButtonState = (color, icon) => {
    buttonState.current.src = icon;
    buttonState.current.style.backgroundColor = color;
  };

  useEffect(() => {
    if (task) {
      if (task.isCompleted) {
        changeButtonState("red", cancel);
      } else {
        changeButtonState("green", done);
      }
    }
  }, [task]);

  return (
    <div className={styles.task}>
      <div className={styles.info}>
        <div className={styles.firstColumn}>
          <h3>{task.name}</h3>
          <span>{task.icon}</span>
        </div>

        <div className={styles.details}>
          <div>
            <h3>Creador:</h3>
            <span>{task.creator}</span>
          </div>
          <div>
            <h3>Descripcion:</h3>
            <span>{task.description}</span>
          </div>
          <div
            className={
              task.isCompleted ? styles.stateCompleted : styles.statePending
            }
          >
            <span>
              <a>Estado: </a>
              {task.isCompleted ? "Completado" : "Pendiente"}
            </span>
          </div>

          <div className={styles.changeState}>
            <span>
              {task.isCompleted
                ? "Marcar como Pendiente"
                : "Marcar como realizada"}
            </span>
            <img onClick={handleChangeState} ref={buttonState}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
