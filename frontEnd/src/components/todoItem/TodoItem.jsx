import { useState } from "react";
import styles from "./TodoItem.module.css";
import iconMenuTask from "../../assets/img/menuTask.png";
import iconIncompleted from "../../assets/img/incompleted.png";
import iconChecked from "../../assets/img/checked.png";
import EditTodoForm from "../editTodoForm/EditTodoForm";
import DetailsTodo from "../detailsTodo/DetailsTodo";
import Modal from "../modal/Modal";
import { FormTaskProvider } from "../../context/formTaskContext/FormTaskContext.jsx";
import { MenuOption } from "./menuOptions/MenuOptions";
import { useWindowSize } from "../../context/WindowSizeContext";
import { AlertQuestionSwal, AlertFormSwal } from "../sweetAlert/sweetAlert.js";
import { useTasks } from "../../context/TaskContext.jsx";

const TodoItem = ({ task, index }) => {
  const [openMenuTask, setOpenMenuTask] = useState(false);
  const { patchStateTask } = useTasks();
  const { windowWidth } = useWindowSize();
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const changeState = async (task) => {
    let question = `Do you want mark this task like ${
      task.isCompleted ? "pending?" : "completed?"
    }`;

    let confirm = await AlertQuestionSwal(
      windowWidth,
      question,
      "",
      task.isCompleted ? "green" : "red"
    );

    if (confirm) {
      const result = await patchStateTask(
        task.isCompleted ? 0 : 1,
        task.idTask
      );

      if (!result) {
        AlertFormSwal(
          "Couldn't change the task state",
          "Oops",
          "error",
          windowWidth
        );
      } else {
        AlertFormSwal("Task state changed!", "Success", "success", windowWidth);
      }
    }
  };

  const formatToStringDate = (date) => {
    let dateTask = new Date(date);

    let datetimeString = new Intl.DateTimeFormat("en-UY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(dateTask);

    return datetimeString;
  };

  const openMenu = () => {
    if (!openMenuTask) setOpenMenuTask(true);
    else setOpenMenuTask(false);
  };
  return (
    <>
      <li
        style={{
          background:
            index % 2 == 0 ? "rgba(240, 240, 240, 1)" : "rgba(255, 255, 255, 1)"
        }}
        className={styles.task}
      >
        <div className={styles.info}>
          <div className={styles.icon}>
            <span>{task.icon}</span>
          </div>
          <div className={styles.descriptionAndDate}>
            <span>{formatToStringDate(task.datetimeTask)}</span>
            <p>{task.descriptionTask}</p>

            <div
              className={
                !task.isCompleted ? styles.statePending : styles.stateCompleted
              }
            >
              <button onClick={() => changeState(task)}>
                <img
                  src={task.isCompleted ? iconChecked : iconIncompleted}
                ></img>
              </button>
              <span>{task.isCompleted ? "Completed" : "Pending"}</span>
            </div>
          </div>
        </div>

        <div className={styles.menuTask}>
          <div
            className={
              openMenuTask && windowWidth <= 699
                ? styles.openMenuDisplay
                : styles.openMenu
            }
          >
            <img onClick={openMenu} src={iconMenuTask}></img>
          </div>

          {(openMenuTask || windowWidth >= 699) && (
            <MenuOption
              setOpenModalInfo={setOpenModalInfo}
              setOpenModalUpdate={setOpenModalUpdate}
              task={task}
            />
          )}
        </div>
      </li>
      {openModalUpdate && (
        <Modal>
          <FormTaskProvider>
            <EditTodoForm task={task} setOpenModalUpdate={setOpenModalUpdate} />
          </FormTaskProvider>
        </Modal>
      )}

      {openModalInfo && (
        <Modal>
          <DetailsTodo task={task} setOpenModalInfo={setOpenModalInfo} />
        </Modal>
      )}
    </>
  );
};

export default TodoItem;
