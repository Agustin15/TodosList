import { useState } from "react";
import styles from "./TodoItem.module.css";
import { Link } from "react-router-dom";
import EditTodoForm from "../editTodoForm/EditTodoForm";

const TodoItem = ({ task }) => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  return (
    <>
      <li key={task.id} className={styles.task}>
        <div className={styles.info}>
          <div className={styles.icon}>
            <span>{task.icon}</span>
          </div>

          <div className={styles.dataTask}>
            <span>{task.name}</span>
            <span>
              <a>Creator: </a>
              {task.creator}
            </span>
            <div>
              <p>{task.description}</p>
            </div>
            <span
              className={
                task.isCompleted
                  ? styles.stateCompletedTask
                  : styles.statePendingTask
              }
            >
              <a>State: </a>
              {task.isCompleted ? "Completada" : "Pendiente"}
            </span>
          </div>
        </div>

        <div className={styles.options}>
          <a onClick={() => setOpenModalUpdate(true)}>Edit</a>
          <Link className={styles.details} to={`${task.id}`}>
            Details
          </Link>
        </div>
      </li>

      {openModalUpdate && (
        <EditTodoForm task={task} setOpenModalUpdate={setOpenModalUpdate} />
      )}
    </>
  );
};

export default TodoItem;
