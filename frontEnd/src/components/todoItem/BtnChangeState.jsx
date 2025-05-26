import styles from "./TodoItem.module.css";
import pendingIcon from "../../assets/img/pendingTask.png";
import completeIcon from "../../assets/img/completeTask.png";

export const BtnChangeState = ({ task, setOpenModalChangeStatus }) => {
  return (
    <button
      className={
        task.isCompleted ? styles.btnStateComplete : styles.btnStateIncomplete
      }
      onClick={() => setOpenModalChangeStatus(true)}
    >
      <img src={task.isCompleted ? completeIcon : pendingIcon}></img>
    </button>
  );
};
