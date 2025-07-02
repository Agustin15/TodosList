import iconDelete from "../../assets/img/deleteIcon.png";
import iconError from "../../assets/img/errorIcon3.png";
import styles from "./DeleteTask.module.css";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
const DeleteTask = ({ task, setOpenModalDelete }) => {
  const { deleteTask, dispatch, tasks } = useTasks();

  const [alert, setAlert] = useState(false);
  const {
    getQuantityTasksFilter,
    getTasksFilter,
    indexSelected,
    setIndexSelected,
    getTasksThisWeekByStateAndUser,
    getTasksThisWeekByStateAndUserLimit,
    refCheckBoxThisWeek
  } = useFilterOptionTasks();

  const handleDelete = async () => {
    let taskDeleted = await deleteTask(task.idTask);
    if (taskDeleted) {
      setOpenModalDelete(false);
      eventDeleted();
    } else {
      setAlert(true);
    }
  };

  const eventDeleted = () => {
    if (refCheckBoxThisWeek.current.checked) {
      getTasksThisWeekByStateAndUser();
      getTasksThisWeekByStateAndUserLimit(
        tasks.length == 1 && indexSelected > 1
          ? indexSelected
          : indexSelected + 1,
        dispatch
      );
    } else {
      getQuantityTasksFilter("getQuantityTasksByFilterOption");
      getTasksFilter(
        "getTasksLimitByFilterOption",
        tasks.length == 1 && indexSelected > 1
          ? indexSelected
          : indexSelected + 1,
        dispatch
      );
    }

    if (tasks.length == 1 && indexSelected > 1) {
      setIndexSelected(indexSelected - 1);
    }
  };

  return (
    <div className={styles.deleteTask}>
      <img src={iconDelete}></img>
      <span>Do you want to delete this task?</span>
      <div className={styles.containButtons}>
        <button onClick={handleDelete}>Confirm</button>
        <button onClick={() => setOpenModalDelete(false)}>Cancel</button>
      </div>

      {alert && (
        <div className={styles.alert}>
          <img src={iconError}></img>
          <span>Oops,can't delete task</span>
        </div>
      )}
    </div>
  );
};

export default DeleteTask;
