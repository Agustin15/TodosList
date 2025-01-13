import { useState } from "react";
import styles from "./TodoItem.module.css";
import iconDelete from "../../assets/img/delete.png";
import iconInfo from "../../assets/img/info.png";
import pendingIcon from "../../assets/img/pendingTask.png";
import completeIcon from "../../assets/img/completeTask.png";
import iconEdit from "../../assets/img/editing.png";
import EditTodoForm from "../editTodoForm/EditTodoForm";
import DetailsTodo from "../detailsTodo/DetailsTodo";
import Modal from "../modal/Modal";
import DeleteTask from "../DeleteTask/DeleteTaks";
import ChangeStatusItem from "../changeStatusTask/ChangeStatusItem";

const TodoItem = ({ task }) => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);

  return (
    <>
      <li key={task.id} className={styles.task}>
        <div className={styles.info}>
          <img
            onClick={() => setOpenModalChangeStatus(true)}
            src={task.isCompleted ? completeIcon : pendingIcon}
          ></img>
          <div className={styles.icon}>
            <span>{task.icon}</span>
          </div>
          <div className={styles.descriptionAndName}>
            <span>{task.name}</span>
            <p>{task.description}</p>
          </div>
        </div>

        <div className={styles.options}>
          <div onClick={() => setOpenModalDelete(true)}>
            <img src={iconDelete}></img>
          </div>
          <div
            onClick={() => {
              setOpenModalUpdate(true);
            }}
          >
            <img src={iconEdit}></img>
          </div>
          <div
            onClick={() => {
              setOpenModalInfo(true);
            }}
          >
            <img src={iconInfo}></img>
          </div>
        </div>
      </li>

      {openModalUpdate && (
        <Modal>
          <EditTodoForm task={task} setOpenModalUpdate={setOpenModalUpdate} />
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
