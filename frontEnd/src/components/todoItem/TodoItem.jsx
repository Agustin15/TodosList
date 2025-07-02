import {useState } from "react";
import styles from "./TodoItem.module.css";
import iconDelete from "../../assets/img/delete.png";
import iconInfo from "../../assets/img/info.png";
import iconEdit from "../../assets/img/editing.png";
import EditTodoForm from "../editTodoForm/EditTodoForm";
import DetailsTodo from "../detailsTodo/DetailsTodo";
import Modal from "../modal/Modal";
import { BtnChangeState } from "./BtnChangeState";
import DeleteTask from "../DeleteTask/DeleteTaks";
import ChangeStatusItem from "../changeStatusTask/ChangeStatusItem";
import { SubscriptionProvider } from "../../context/SubscriptionContext";

const TodoItem = ({ task, index }) => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);

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

  return (
    <>
      <li
        key={task.id}
        style={{ background: index % 2 == 0 ? "rgb(221, 221, 221)" : "rgb(241, 241, 241)" }}
        className={styles.task}
      >
        <div className={styles.info}>
          <BtnChangeState
            task={task}
            setOpenModalChangeStatus={setOpenModalChangeStatus}
          />
          <div className={styles.icon}>
            <span>{task.icon}</span>
          </div>
          <div className={styles.descriptionAndDate}>
            <span>{formatToStringDate(task.datetimeTask)}</span>
            <p>{task.descriptionTask}</p>
            <span className={styles.files}>
              Files attachment:{task.filesUploaded.length}
            </span>
          </div>
        </div>

        <div className={styles.options}>
          <div className={styles.containState}>
            <span style={{ color: task.isCompleted ? "green" : "red" }}>
              {task.isCompleted ? "Completed" : "Pending"}
            </span>
            <BtnChangeState
              task={task}
              setOpenModalChangeStatus={setOpenModalChangeStatus}
            />
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.btnDelete}
              onClick={() => setOpenModalDelete(true)}
            >
              <img src={iconDelete}></img>
            </button>
            <button
              disabled={
                Date.now() > new Date(task.datetimeTask).getTime()
                  ? true
                  : false
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
      </li>

      {openModalUpdate && (
        <Modal>
          <SubscriptionProvider>
            <EditTodoForm task={task} setOpenModalUpdate={setOpenModalUpdate} />
          </SubscriptionProvider>
        </Modal>
      )}

      {openModalDelete && (
        <Modal>
          <DeleteTask task={task} setOpenModalDelete={setOpenModalDelete} />
        </Modal>
      )}
      {openModalChangeStatus && (
        <Modal>
          <ChangeStatusItem
            task={task}
            setOpenModalChangeStatus={setOpenModalChangeStatus}
          />
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
