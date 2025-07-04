import styles from "./MenuOption.module.css";
import iconDelete from "../../../assets/img/delete.png";
import iconInfo from "../../../assets/img/info.png";
import iconEdit from "../../../assets/img/editing.png";
import { AlertFormSwal, AlertQuestionSwal } from "../../sweetAlert/sweetAlert";
import { useState } from "react";
import { useTasks } from "../../../context/TaskContext";
import { useWindowSize } from "../../../context/WindowSizeContext";
import { useFilterOptionTasks } from "../../../context/FilterOptionTasksContext";

export const MenuOption = ({ task, setOpenModalInfo, setOpenModalUpdate }) => {
  const { deleteTask, dispatch, tasks } = useTasks();
  const { windowWidth } = useWindowSize();
  const {
    getQuantityTasksFilter,
    getTasksFilter,
    indexSelected,
    setIndexSelected,
    getTasksThisWeekByStateAndUser,
    getTasksThisWeekByStateAndUserLimit,
    refCheckBoxThisWeek
  } = useFilterOptionTasks();

  const handleDeleteTask = async () => {
    const confirm = await AlertQuestionSwal(
      windowWidth,
      "Do you want delete this task?",
      "",
      "red"
    );

    if (confirm) {
      let taskDeleted = await deleteTask(task.idTask);
      if (!taskDeleted) {
        AlertFormSwal("Couldn't delete the task", "Oops", "error", windowWidth);
      } else {
        AlertFormSwal("Task deleted!", "Success", "success", windowWidth);
        eventDeleted();
      }
    }
  };
  const eventDeleted = () => {
    if (refCheckBoxThisWeek.current.checked) {
      getTasksThisWeekByStateAndUser();
      getTasksThisWeekByStateAndUserLimit(indexSelected, dispatch);
    } else {
      getQuantityTasksFilter("getQuantityTasksByFilterOption");
      getTasksFilter("getTasksLimitByFilterOption", indexSelected, dispatch);
    }

    if (tasks.length == 1 && indexSelected > 1) {
      setIndexSelected(indexSelected - 1);
    }
  };

  return (
    <div className={styles.options}>
      <div className={styles.buttons}>
        <button className={styles.btnDelete} onClick={handleDeleteTask}>
          <img src={iconDelete}></img>
        </button>
        <button
          disabled={
            Date.now() > new Date(task.datetimeTask).getTime() ? true : false
          }
          className={
            Date.now() > new Date(task.datetimeTask).getTime()
              ? styles.btnUpdateDisabled
              : styles.btnUpdate
          }
          onClick={() => {
            setOpenModalUpdate(true);
          }}
        >
          <img src={iconEdit}></img>
        </button>
        <button
          className={styles.btnDetails}
          onClick={() => {
            setOpenModalInfo(true);
          }}
        >
          <img src={iconInfo}></img>
        </button>
      </div>
    </div>
  );
};
