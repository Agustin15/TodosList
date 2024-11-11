import { useEffect, useRef, useState } from "react";
import styles from "./DetailsTask.module.css";
import done from "../../assets/img/correctIcon.png";
import cancel from "../../assets/img/cancel.png";

const DetailsTask = ({ params }) => {
  const [task, setTask] = useState({});
  const buttonState = useRef();

  const getTaskById = async () => {
    let data = null;
    try {
      const response = await fetch(
        "http://localhost:3000/todos?id=" + params.id
      );
      const result = await response.json();
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  useEffect(() => {
    const getDataTask = async () => {
      const data = await getTaskById();
      setTask(...data);
    };
    getDataTask();
  }, []);

  const changeButtonState = (color, icon) => {
    buttonState.current.src = icon;
    buttonState.current.style.backgroundColor = color;
  };

  useEffect(() => {
    if (task.isCompleted) {
      changeButtonState("red", cancel);
    } else {
      changeButtonState("green", done);
    }
  }, [task]);

  const putTask = async () => {
    let newState;
    task.isCompleted ? newState == false : newState == true;
    try {
      const response = await fetch(
        "http://localhost:3000/todos/"+task.id,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({isCompleted: newState }),
        }
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeState = async () => {
    let resultPut = await putTask();
    console.log(resultPut);
  };

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

export default DetailsTask;
