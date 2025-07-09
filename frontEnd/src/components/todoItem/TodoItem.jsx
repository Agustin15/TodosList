import { useState } from "react";
import styles from "./TodoItem.module.css";
import iconMenuTask from "../../assets/img/menuTask.png";
import EditTodoForm from "../editTodoForm/EditTodoForm";
import DetailsTodo from "../detailsTodo/DetailsTodo";
import Modal from "../modal/Modal";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
import { MenuOption } from "./menuOptions/MenuOptions";
import { useWindowSize } from "../../context/WindowSizeContext";
import { AlertQuestionSwal, AlertFormSwal } from "../sweetAlert/sweetAlert.js";
import { GlassEffect } from "../glassEffect/GlassEffect.jsx";
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
        key={task.id}
        style={{
          background:
            index % 2 == 0 ? "rgb(221, 221, 221)" : "rgb(241, 241, 241)"
        }}
        className={styles.task}
      >
        <div className={styles.info}>
          <div
            className={
              task.isCompleted ? styles.iconCompleted : styles.iconPending
            }
            onClick={() => changeState(task)}
          >
            <span>{task.icon}</span>
            <GlassEffect />
          </div>
          <div className={styles.descriptionAndDate}>
            <span>{formatToStringDate(task.datetimeTask)}</span>
            <p>{task.descriptionTask}</p>

            <span className={styles.files}>
              Files attachment:{task.filesUploaded.length}
            </span>
            <div
              className={
                openMenuTask && windowWidth <= 699
                  ? styles.openMenuDisplay
                  : styles.openMenu
              }
            >
              <img onClick={openMenu} src={iconMenuTask}></img>
            </div>
          </div>
        </div>

        {(openMenuTask || windowWidth >= 699) && (
          <MenuOption
            setOpenModalInfo={setOpenModalInfo}
            setOpenModalUpdate={setOpenModalUpdate}
            task={task}
          />
        )}
      </li>
      {openModalUpdate && (
        <Modal>
          <SubscriptionProvider>
            <EditTodoForm task={task} setOpenModalUpdate={setOpenModalUpdate} />
          </SubscriptionProvider>
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
