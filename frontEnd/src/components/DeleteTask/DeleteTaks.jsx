import iconDelete from "../../assets/img/deleteIcon.png";
import iconError from "../../assets/img/errorIcon3.png";
import styles from "./DeleteTask.module.css";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";

const DeleteTask = ({ task, setOpenModalDelete }) => {
  const { deleteTask } = useTasks();
  const [alert, setAlert] = useState(false);

  const handleDelete = async () => {
    let taskDeleted = await deleteTask(task._id);
    if (taskDeleted) {
      setOpenModalDelete(false);
    } else {
      setAlert(true);
    }
  };
  return (
    <div className={styles.deleteTask}>
      <img src={iconDelete}></img>
      <span>Do you want to delete "{task.name}"?</span>
      <div className={styles.containButtons}>
        <button onClick={handleDelete}>Confirm</button>
        <button onClick={() => setOpenModalDelete(false)}>Cancel</button>
      </div>

      {alert && (
        <div className={styles.alert}>
          <img src={iconError}></img>
          <span>oops,Can't delete task</span>
        </div>
      )}
    </div>
  );
};

export default DeleteTask;
