import styles from "./TodoItem.module.css";
import { Link } from "react-router-dom";

const TodoItem = ({task}) => {
  return (
    <li key={task.id} className={styles.task}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <span>{task.icon}</span>
        </div>

        <div className={styles.dataTask}>
          <span>{task.name}</span>
          <span>
            <a>Creador: </a>
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
            <a>Estado: </a>
            {task.isCompleted ? "Completada" : "Pendiente"}
          </span>
        </div>
      </div>

      <Link className={styles.details} to={`${task.id}`}>
        Details
      </Link>
    </li>
  );
};

export default TodoItem;
