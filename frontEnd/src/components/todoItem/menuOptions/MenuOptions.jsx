import styles from "./MenuOption.module.css";
import iconDelete from "../../../assets/img/delete.png";
import iconInfo from "../../../assets/img/info.png";
import iconEdit from "../../../assets/img/editing.png";
import { AlertFormSwal, AlertQuestionSwal } from "../../sweetAlert/sweetAlert";
import { useTasks } from "../../../context/TaskContext";
import { useWindowSize } from "../../../context/WindowSizeContext";
import { useFilterOptionTasks } from "../../../context/FilterOptionTasksContext";

export const MenuOption = ({ task, setOpenModalInfo, setOpenModalUpdate }) => {
  const { deleteTask, dispatch, tasks } = useTasks();
  const { windowWidth } = useWindowSize();
  const {
    indexSelected,
    setIndexSelected,
    queryTasksDependingOptions,
    optionSearch,
    idTask
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

  const eventDeleted = async () => {
    if (optionSearch || idTask) {
      dispatch({
        type: "setTasks",
        payload: tasks.filter((taskItem) => taskItem.idTask != task.idTask)
      });
    } else {
      await queryTasksDependingOptions();
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
